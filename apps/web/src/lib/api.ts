import localforage from "localforage";

const apiUrl = import.meta.env.VITE_API_URL as string;

interface LLMData {
  model: string;
  messages: {
    role: string;
    content: string;
  }[];
}
interface Quota {
  type: string;
  value: number;
}
interface QuotaConsumption {
  totalUsage: number;
}
export interface LineMessageQuota {
  quota: Quota;
  consumption: QuotaConsumption;
}
export interface WebhookEndpoint {
  endpoint: string;
  active: boolean;
}

const getToken = async () => {
  const token = await localforage.getItem("token");
  return token;
};

export const generateMessage = async (data: LLMData) => {
  const response = await fetch(`${apiUrl}/api/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result.choices[0].message.content;
};

export const getLineMessageQuota = async (
  workspaceId: string,
): Promise<LineMessageQuota> => {
  const token = await getToken();
  const response = await fetch(
    `${apiUrl}/api/line/message-quota?workspaceId=${workspaceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const result = await response.json();
  return result;
};

export const getWebhookEndpoint = async (
  workspaceId: string,
): Promise<WebhookEndpoint> => {
  const token = await getToken();
  const response = await fetch(
    `${apiUrl}/api/line/webhook-endpoint?workspaceId=${workspaceId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const result = await response.json();
  return result;
};

export const sendLineMessage = async (
  workspaceId: string,
  memberId: string,
  message: string,
) => {
  const token = await getToken();
  await fetch(`${apiUrl}/api/line/text-message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      workspaceId: workspaceId,
      memberId: memberId,
      message: message,
    }),
  });
};
