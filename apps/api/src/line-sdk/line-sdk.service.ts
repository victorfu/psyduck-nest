import { FirebaseAdminService } from "@/firebase-admin/firebase-admin.service";
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";

// https://github.com/line/line-bot-sdk-nodejs/issues/1021
// export MessagingApiClient from "@line/bot-sdk" is not working
import { messagingApi, middleware, webhook } from "@line/bot-sdk";
import { LineUserDto } from "./dto/line-user.dto";
import { filterUndefined } from "@/utils";
const { MessagingApiClient } = messagingApi;

interface LineConfig {
  channelAccessToken: string;
  channelSecret?: string;
}

@Injectable()
export class LineSdkService {
  private readonly logger = new Logger(LineSdkService.name);

  constructor(private readonly firebaseAdminService: FirebaseAdminService) {}

  async getLineConfig(
    workspaceId: string,
    requireSecret = false,
  ): Promise<LineConfig> {
    /**
     * Get LINE configuration for a workspace.
     *
     * @param workspaceId - The ID of the workspace
     * @param requireSecret - Whether to require channel secret
     * @returns A object containing the LINE configuration
     * @throws NotFoundException - If workspace is not found
     * @throws BadRequestException - If LINE configuration is invalid
     */
    if (!workspaceId) {
      throw new BadRequestException("workspaceId is required");
    }

    const db = this.firebaseAdminService.getDb();
    const doc = await db.collection("workspaces").doc(workspaceId).get();
    if (!doc.exists) {
      this.logger.error(`Workspace ${workspaceId} not found`);
      throw new NotFoundException(`Workspace ${workspaceId} not found`);
    }

    const lineConfig = doc.get("lineConfig");
    if (!lineConfig) {
      this.logger.error(`Workspace ${workspaceId} has no line config`);
      throw new BadRequestException(
        `Workspace ${workspaceId} has no line config`,
      );
    }

    const channelAccessToken = lineConfig.channelAccessToken;
    if (!channelAccessToken) {
      this.logger.error(`Workspace ${workspaceId} has no channel access token`);
      throw new BadRequestException(
        `Workspace ${workspaceId} has no channel access token`,
      );
    }

    if (requireSecret) {
      const channelSecret = lineConfig.channelSecret;
      if (!channelSecret) {
        this.logger.error(`Workspace ${workspaceId} has no channel secret`);
        throw new BadRequestException(
          `Workspace ${workspaceId} has no channel secret`,
        );
      }
      return {
        channelAccessToken,
        channelSecret,
      };
    }

    return { channelAccessToken };
  }

  async getLineApiClient(workspaceId: string) {
    const config = await this.getLineConfig(workspaceId);
    if (!config.channelAccessToken) {
      throw new BadRequestException(
        `Workspace ${workspaceId} has no channel access token`,
      );
    }
    return new MessagingApiClient({
      channelAccessToken: config.channelAccessToken,
    });
  }

  async getMiddleware(workspaceId: string) {
    const config = await this.getLineConfig(workspaceId, true);
    if (!config.channelAccessToken) {
      throw new BadRequestException(
        `Workspace ${workspaceId} has no channel access token`,
      );
    }
    if (!config.channelSecret) {
      throw new BadRequestException(
        `Workspace ${workspaceId} has no channel secret`,
      );
    }
    return middleware({
      channelAccessToken: config.channelAccessToken,
      channelSecret: config.channelSecret,
    });
  }

  async getMessageQuota(workspaceId: string) {
    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }
    const client = await this.getLineApiClient(workspaceId);
    const quota = await client.getMessageQuota();
    const consumption = await client.getMessageQuotaConsumption();
    return {
      quota,
      consumption,
    };
  }

  async getWebhookEndpoint(workspaceId: string) {
    if (!workspaceId) {
      throw new Error("workspaceId is required");
    }
    const client = await this.getLineApiClient(workspaceId);
    const endpoint = await client.getWebhookEndpoint();
    return endpoint;
  }

  replyText = (client: messagingApi.MessagingApiClient, token, texts) => {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage({
      replyToken: token,
      messages: texts.map((text) => ({ type: "text", text })),
    });
  };

  async handleEvents(workspaceId: string, events: webhook.Event[]) {
    const client = await this.getLineApiClient(workspaceId);
    await Promise.all(
      events.map((event) => this.handleEvent(client, event, workspaceId)),
    );
  }

  async handleEvent(
    client: messagingApi.MessagingApiClient,
    event: webhook.Event,
    workspaceId: string,
  ) {
    switch (event.type) {
      case "message":
        const message = event.message;
        switch (message.type) {
          case "text":
            return this.handleText(
              client,
              message,
              event.replyToken,
              event.source,
              workspaceId,
            );
          case "image":
          case "video":
          case "audio":
          case "location":
          case "sticker":
            return;
          default:
            throw new Error(`Unknown message: ${JSON.stringify(message)}`);
        }

      case "follow":
        const userId = event.source.userId;
        try {
          // Get existing line users
          const lineUsers =
            await this.firebaseAdminService.getLineUsersByLineUserId(
              userId,
              workspaceId,
            );

          if (lineUsers.length === 0) {
            const profile = await client.getProfile(userId);

            let lineUserData = {
              lineUserId: userId,
              workspaceId: workspaceId,
              displayName: profile.displayName,
              pictureUrl: profile.pictureUrl,
              statusMessage: profile.statusMessage,
              language: profile.language,
              isFollowing: true,
            } as LineUserDto;
            lineUserData = filterUndefined(lineUserData);

            await this.firebaseAdminService
              .getDb()
              .collection("line-users")
              .add(lineUserData);
          } else {
            await this.firebaseAdminService
              .getDb()
              .collection("line-users")
              .doc(lineUsers[0].id)
              .update({ isFollowing: true });
          }
          this.logger.debug(`Got Follow event: ${userId}`);
        } catch (error) {
          this.logger.error(`Error handling follow event: ${error}`);
        }
        return;

      case "unfollow":
        const unfollowUserId = event.source.userId;
        try {
          const lineUsers =
            await this.firebaseAdminService.getLineUsersByLineUserId(
              unfollowUserId,
              workspaceId,
            );

          if (lineUsers.length === 0) {
            this.logger.debug(`Got Unfollow event: ${unfollowUserId}`);
            return;
          }

          await this.firebaseAdminService
            .getDb()
            .collection("line-users")
            .doc(lineUsers[0].id)
            .update({ isFollowing: false });

          this.logger.debug(`Got Unfollow event: ${unfollowUserId}`);
        } catch (error) {
          this.logger.error(`Error handling unfollow event: ${error}`);
        }
        return;

      case "join":
        return this.logger.debug(`Got Join event: ${JSON.stringify(event)}`);

      case "leave":
        return this.logger.debug(`Got Leave event: ${JSON.stringify(event)}`);

      case "postback":
        let data = event.postback.data;
        if (data === "DATE" || data === "TIME" || data === "DATETIME") {
          data += `(${JSON.stringify(event.postback.params)})`;
        }
        return this.logger.debug(`Got postback: ${data}`);

      case "beacon":
        return this.logger.debug(`Got beacon: ${event.beacon.hwid}`);

      default:
        throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    }
  }

  async handleText(
    client: messagingApi.MessagingApiClient,
    message: webhook.TextMessageContent,
    replyToken: string,
    source: webhook.Source,
    workspaceId: string,
  ) {
    const buttonsImageURL = `https://example.com/images/buttons/1040.jpg`;
    this.logger.debug(
      `Got text: ${message.text}, source: ${JSON.stringify(source)}`,
    );

    const lineUserId = source.userId;
    const lineUsers = await this.firebaseAdminService.getLineUsersByLineUserId(
      lineUserId,
      workspaceId,
    );

    if (lineUsers.length === 0) {
      this.logger.debug(`No line user found for lineUserId: ${lineUserId}`);
      return;
    }

    const lineUser = lineUsers[0];

    if (lineUser.waitingForPhone) {
      const phoneNumber = message.text;

      // Validate phone number format
      if (!/^\d+$/.test(phoneNumber) || phoneNumber.length < 8) {
        return client.replyMessage({
          replyToken,
          messages: [
            {
              type: "text",
              text: "請輸入有效的電話號碼",
            },
          ],
        });
      }

      // Get members with this phone number
      const members = await this.firebaseAdminService.getMembersByPhone(
        phoneNumber,
        workspaceId,
      );

      if (members.length === 0) {
        return client.replyMessage({
          replyToken,
          messages: [
            {
              type: "text",
              text: "無此電話號碼",
            },
          ],
        });
      }

      if (members.length !== 1) {
        return client.replyMessage({
          replyToken,
          messages: [
            {
              type: "text",
              text: "有重複的電話號碼",
            },
          ],
        });
      }

      const member = members[0];

      // Update user document with phone number and clear waiting state
      await this.firebaseAdminService
        .getDb()
        .collection("line-users")
        .doc(lineUser.id)
        .update({
          phone: phoneNumber,
          waitingForPhone: false,
          memberId: member.id,
        });

      return client.replyMessage({
        replyToken,
        messages: [
          {
            type: "text",
            text: "電話號碼綁定成功！",
          },
        ],
      });
    }

    switch (message.text) {
      case "綁定":
        if (lineUser.memberId && lineUser.phone) {
          return client.replyMessage({
            replyToken,
            messages: [
              {
                type: "text",
                text: `您已綁定過電話號碼 ${lineUser.phone}, 請輸入解除綁定後再試一次`,
              },
            ],
          });
        }

        await this.firebaseAdminService
          .getDb()
          .collection("line-users")
          .doc(lineUser.id)
          .update({ waitingForPhone: true });

        return client.replyMessage({
          replyToken,
          messages: [
            {
              type: "text",
              text: "請輸入您的電話號碼",
            },
          ],
        });

      case "解除綁定":
        await this.firebaseAdminService
          .getDb()
          .collection("line-users")
          .doc(lineUser.id)
          .update({
            phone: "",
            memberId: "",
            waitingForPhone: false,
          });

        return client.replyMessage({
          replyToken,
          messages: [
            {
              type: "text",
              text: "綁定已解除",
            },
          ],
        });
      case "buttons":
        return client.replyMessage({
          replyToken,
          messages: [
            {
              type: "template",
              altText: "Buttons alt text",
              template: {
                type: "buttons",
                thumbnailImageUrl: buttonsImageURL,
                title: "My button sample",
                text: "Hello, my button",
                actions: [
                  {
                    label: "Go to line.me",
                    type: "uri",
                    uri: "https://line.me",
                  },
                  {
                    label: "Say hello1",
                    type: "postback",
                    data: "hello こんにちは",
                  },
                  {
                    label: "言 hello2",
                    type: "postback",
                    data: "hello こんにちは",
                    text: "hello こんにちは",
                  },
                  { label: "Say message", type: "message", text: "Rice=米" },
                ],
              },
            },
          ],
        });
      case "confirm":
        return client.replyMessage({
          replyToken,
          messages: [
            {
              type: "template",
              altText: "Confirm alt text",
              template: {
                type: "confirm",
                text: "Do it?",
                actions: [
                  { label: "Yes", type: "message", text: "Yes!" },
                  { label: "No", type: "message", text: "No!" },
                ],
              },
            },
          ],
        });
      case "carousel":
        return client.replyMessage({
          replyToken,
          messages: [
            {
              type: "template",
              altText: "Carousel alt text",
              template: {
                type: "carousel",
                columns: [
                  {
                    thumbnailImageUrl: buttonsImageURL,
                    title: "hoge",
                    text: "fuga",
                    actions: [
                      {
                        label: "Go to line.me",
                        type: "uri",
                        uri: "https://line.me",
                      },
                      {
                        label: "Say hello1",
                        type: "postback",
                        data: "hello こんにちは",
                      },
                    ],
                  },
                  {
                    thumbnailImageUrl: buttonsImageURL,
                    title: "hoge",
                    text: "fuga",
                    actions: [
                      {
                        label: "言 hello2",
                        type: "postback",
                        data: "hello こんにちは",
                        text: "hello こんにちは",
                      },
                      {
                        label: "Say message",
                        type: "message",
                        text: "Rice=米",
                      },
                    ],
                  },
                ],
              },
            },
          ],
        });
      case "image carousel":
        return client.replyMessage({
          replyToken,
          messages: [
            {
              type: "template",
              altText: "Image carousel alt text",
              template: {
                type: "image_carousel",
                columns: [
                  {
                    imageUrl: buttonsImageURL,
                    action: {
                      label: "Go to LINE",
                      type: "uri",
                      uri: "https://line.me",
                    },
                  },
                  {
                    imageUrl: buttonsImageURL,
                    action: {
                      label: "Say hello1",
                      type: "postback",
                      data: "hello こんにちは",
                    },
                  },
                  {
                    imageUrl: buttonsImageURL,
                    action: {
                      label: "Say message",
                      type: "message",
                      text: "Rice=米",
                    },
                  },
                  {
                    imageUrl: buttonsImageURL,
                    action: {
                      label: "datetime",
                      type: "datetimepicker",
                      data: "DATETIME",
                      mode: "datetime",
                    },
                  },
                ],
              },
            },
          ],
        });
      case "datetime":
        return client.replyMessage({
          replyToken,
          messages: [
            {
              type: "template",
              altText: "Datetime pickers alt text",
              template: {
                type: "buttons",
                text: "Select date / time !",
                actions: [
                  {
                    type: "datetimepicker",
                    label: "date",
                    data: "DATE",
                    mode: "date",
                  },
                  {
                    type: "datetimepicker",
                    label: "time",
                    data: "TIME",
                    mode: "time",
                  },
                  {
                    type: "datetimepicker",
                    label: "datetime",
                    data: "DATETIME",
                    mode: "datetime",
                  },
                ],
              },
            },
          ],
        });
      case "imagemap":
        return client.replyMessage({
          replyToken,
          messages: [
            {
              type: "imagemap",
              baseUrl: `https://line-bot-sdk-nodejs.herokuapp.com/static/rich`,
              altText: "Imagemap alt text",
              baseSize: { width: 1040, height: 1040 },
              actions: [
                {
                  area: { x: 0, y: 0, width: 520, height: 520 },
                  type: "uri",
                  linkUri: "https://store.line.me/family/manga/en",
                },
                {
                  area: { x: 520, y: 0, width: 520, height: 520 },
                  type: "uri",
                  linkUri: "https://store.line.me/family/music/en",
                },
                {
                  area: { x: 0, y: 520, width: 520, height: 520 },
                  type: "uri",
                  linkUri: "https://store.line.me/family/play/en",
                },
                {
                  area: { x: 520, y: 520, width: 520, height: 520 },
                  type: "message",
                  text: "URANAI!",
                },
              ],
              video: {
                originalContentUrl: `https://line-bot-sdk-nodejs.herokuapp.com/static/imagemap/video.mp4`,
                previewImageUrl: `https://line-bot-sdk-nodejs.herokuapp.com/static/imagemap/preview.jpg`,
                area: {
                  x: 280,
                  y: 385,
                  width: 480,
                  height: 270,
                },
                externalLink: {
                  linkUri: "https://line.me",
                  label: "LINE",
                },
              },
            },
          ],
        });
      case "menu":
        return client.replyMessage({
          replyToken,
          messages: [
            {
              type: "text",
              text: "Quick reply",
              quickReply: {
                items: [
                  {
                    type: "action",
                    action: {
                      type: "message",
                      label: "Button",
                      text: "buttons",
                    },
                  },
                  {
                    type: "action",
                    action: {
                      type: "message",
                      label: "Confirm",
                      text: "confirm",
                    },
                  },
                  {
                    type: "action",
                    action: {
                      type: "message",
                      label: "Carousel",
                      text: "carousel",
                    },
                  },
                  {
                    type: "action",
                    action: {
                      type: "message",
                      label: "Image Carousel",
                      text: "image carousel",
                    },
                  },
                  {
                    type: "action",
                    action: {
                      type: "message",
                      label: "Datetime",
                      text: "datetime",
                    },
                  },
                  {
                    type: "action",
                    action: {
                      type: "message",
                      label: "Image Map",
                      text: "imagemap",
                    },
                  },
                ],
              },
            },
          ],
        });

      default:
        console.log(`Echo message to ${replyToken}: ${message.text}`);
        return this.replyText(client, replyToken, message.text);
    }
  }
}
