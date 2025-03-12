import type { FormProps } from "antd";
import {
  Button,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
} from "antd";
import { useEffect, useState } from "react";
import { useParams, useRevalidator } from "react-router-dom";
import { updateWorkspace, Workspace } from "@/lib/workspace";
import { deleteField } from "firebase/firestore";
import type { DescriptionsProps } from "antd";
import { useWorkspaceLoaderData } from "@/hooks/use-data";
import {
  getLineMessageQuota,
  getWebhookEndpoint,
  LineMessageQuota,
  WebhookEndpoint,
} from "@/lib/api";
import lineLogo from "@/assets/line-240.png";
import { LineConfig } from "@/lib/workspace";

interface FieldType {
  liffId?: string;
  botId?: string;
  channelId?: string;
  channelSecret?: string;
  channelAccessToken?: string;
  qrCodeUrl?: string;
}

const useLineInfo = ({ workspace }: { workspace: Workspace | null }) => {
  const [messageQuota, setMessageQuota] = useState<LineMessageQuota | null>(
    null,
  );
  const [webhookEndpoint, setWebhookEndpoint] =
    useState<WebhookEndpoint | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workspace || !workspace.id || !workspace.lineConfig) {
      return;
    }

    setLoading(true);
    Promise.all([
      getLineMessageQuota(workspace.id),
      getWebhookEndpoint(workspace.id),
    ])
      .then(([mq, we]) => {
        setMessageQuota(mq);
        setWebhookEndpoint(we);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [workspace]);

  return { messageQuota, webhookEndpoint, loading };
};

export const LineSettings = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { workspaceId } = useParams();
  const { workspace } = useWorkspaceLoaderData();
  const revalidator = useRevalidator();
  const { messageQuota, webhookEndpoint, loading } = useLineInfo({
    workspace,
  });

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    if (!workspaceId) {
      void message.error("工作空間 ID 不存在");
      return;
    }

    try {
      setConfirmLoading(true);
      const lineConfig: LineConfig = {
        liffId: values.liffId ?? "",
        botId: values.botId ?? "",
        channelId: values.channelId ?? "",
        channelSecret: values.channelSecret ?? "",
        channelAccessToken: values.channelAccessToken ?? "",
        qrCodeUrl: values.qrCodeUrl ?? "",
      };
      await updateWorkspace(workspaceId, { lineConfig });
      revalidator.revalidate();
      void message.success("儲存成功");
    } catch (error) {
      void message.error("儲存失敗");
    } finally {
      setOpen(false);
      setConfirmLoading(false);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = () => {
    void message.error("儲存失敗");
  };

  const handleDelete = async () => {
    if (!workspaceId) {
      void message.error("工作空間 ID 不存在");
      return;
    }

    try {
      setConfirmLoading(true);
      await updateWorkspace(workspaceId, { lineConfig: deleteField() });
      revalidator.revalidate();
      void message.success("刪除成功");
    } catch (error) {
      void message.error("刪除失敗");
    } finally {
      setOpen(false);
      setConfirmLoading(false);
    }
  };

  const LineDescription = ({ lineConfig }: { lineConfig: LineConfig }) => {
    const status =
      webhookEndpoint?.active && webhookEndpoint?.endpoint ? (
        <div className="flex items-center gap-2">
          <img src={lineLogo} alt="LINE" className="w-6 h-6" />
          <div className="text-green-500">已啟用</div>
        </div>
      ) : (
        <div>
          已啟用，
          <a
            href={`https://developers.line.biz/console/channel/${lineConfig.channelId}/messaging-api`}
            target="_blank"
            rel="noreferrer"
          >
            Webhook 尚未設定完成
          </a>
        </div>
      );

    // https://developers.line.biz/console/channel/1489585848/messaging-api

    const statusChildren = loading ? "讀取中..." : status;

    const messageQuotaChildren = loading ? (
      "讀取中..."
    ) : (
      <div className="flex gap-2">
        <div>額度: {messageQuota?.quota?.value}</div>
        <div>使用量: {messageQuota?.consumption?.totalUsage}</div>
      </div>
    );

    const items: DescriptionsProps["items"] = [
      {
        label: "狀態",
        children: statusChildren,
      },
      {
        label: "額度",
        span: "filled",
        children: messageQuotaChildren,
      },
      {
        label: "BOT ID",
        children: (
          <div>
            <a
              href={`https://developers.line.biz/console/channel/${lineConfig.channelId}/messaging-api`}
              target="_blank"
              rel="noreferrer"
            >
              {lineConfig.botId}
            </a>
          </div>
        ),
      },
      {
        label: "Channel ID",
        span: "filled",
        children: lineConfig.channelId,
      },
      {
        label: "Channel Secret",
        span: "filled",
        children: lineConfig.channelSecret,
      },
      {
        label: "Channel Access Token",
        span: "filled",
        children: lineConfig.channelAccessToken,
      },
      {
        label: "QR Code URL",
        span: "filled",
        children: (
          <div>
            <a href={lineConfig.qrCodeUrl} target="_blank" rel="noreferrer">
              {lineConfig.qrCodeUrl}
            </a>
            <img className="w-40 h-40" src={lineConfig.qrCodeUrl} />
          </div>
        ),
      },
    ];

    return <Descriptions title="LINE設定" bordered items={items} />;
  };

  return (
    <div className="mt-4 max-w-[640px]">
      {workspace?.lineConfig ? (
        <div>
          {workspace?.lineConfig && (
            <LineDescription lineConfig={workspace.lineConfig} />
          )}
          <Button
            color="primary"
            variant="outlined"
            className="mt-2"
            onClick={showModal}
          >
            編輯
          </Button>
        </div>
      ) : (
        <Button type="primary" onClick={showModal}>
          啟用 LINE 通知
        </Button>
      )}

      <Modal
        title="LINE 通知設定"
        footer={null}
        open={open}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            liffId: workspace?.lineConfig?.liffId ?? "",
            botId: workspace?.lineConfig?.botId ?? "",
            channelId: workspace?.lineConfig?.channelId ?? "",
            channelSecret: workspace?.lineConfig?.channelSecret ?? "",
            channelAccessToken: workspace?.lineConfig?.channelAccessToken ?? "",
            qrCodeUrl: workspace?.lineConfig?.qrCodeUrl ?? "",
          }}
        >
          <Form.Item label="LIFF ID" name="liffId">
            <Input />
          </Form.Item>

          <Form.Item label="BOT ID" name="botId">
            <Input />
          </Form.Item>

          <Form.Item label="Channel ID" name="channelId">
            <Input />
          </Form.Item>

          <Form.Item label="Channel Secret" name="channelSecret">
            <Input />
          </Form.Item>

          <Form.Item label="Channel Access Token" name="channelAccessToken">
            <Input.TextArea rows={6} />
          </Form.Item>

          <Form.Item label="QR Code URL" name="qrCodeUrl">
            <Input />
          </Form.Item>
          {workspace?.lineConfig?.qrCodeUrl && (
            <div className="-mt-5 flex justify-end">
              <img
                src={workspace.lineConfig.qrCodeUrl}
                alt="QR Code"
                className="w-30 h-30"
              />
            </div>
          )}

          <Form.Item label={null}>
            <div className="mt-4 flex justify-end gap-2">
              <Button type="primary" htmlType="submit" loading={confirmLoading}>
                儲存
              </Button>
              <Popconfirm
                title="確認要移除嗎？"
                onConfirm={handleDelete}
                okText="確認"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button danger>刪除</Button>
              </Popconfirm>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
