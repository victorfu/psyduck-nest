import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  FormProps,
  Input,
  Modal,
  Select,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { SendOutlined, SyncOutlined } from "@ant-design/icons";
import { generateMessage } from "@/lib/api";
import { Dayjs } from "dayjs";

export interface MessageFormFields {
  title?: string;
  content?: string;
  sendNow?: boolean;
  scheduledDate?: Dayjs;
  scheduledTime?: string;
  channel:
    | "line"
    | "email"
    | "sms"
    | "line_then_email"
    | "line_then_sms"
    | "email_then_sms";
}

export const MessageForm = ({
  onSubmit,
  onSubmitFailed,
}: {
  onSubmit?: (values: MessageFormFields) => void;
  onSubmitFailed?: () => void;
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const watchSendNow = Form.useWatch(["sendNow"], form);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        type: "text",
        content: "",
        sendNow: false,
        scheduledDate: undefined,
        scheduledTime: undefined,
        channel: "line",
      });
    }
  }, [open, form]);

  const handleCancel = () => {
    setOpen(false);
  };

  const onFinish: FormProps<MessageFormFields>["onFinish"] = (values) => {
    onSubmit?.(values);
    handleCancel();
  };

  const onFinishFailed = () => {
    onSubmitFailed?.();
  };

  const generateContent = async () => {
    const type = form.getFieldValue("type");

    let typeText = "";
    if (type === "care") {
      typeText = "關懷";
    } else if (type === "appointment") {
      typeText = "預約";
    } else if (type === "text") {
      typeText = "隨機";
    }

    const data = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `我需要寄送訊息給客人, 請幫我生成${typeText}的訊息`,
        },
      ],
    };

    try {
      setGenerating(true);
      const result = await generateMessage(data);
      form.setFieldsValue({
        content: result,
      });
    } catch (error) {
      // ignore
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Typography.Link
        onClick={() => {
          setOpen(true);
        }}
      >
        <SendOutlined />
      </Typography.Link>
      <Modal
        title="發送訊息"
        footer={null}
        open={open}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label="訊息類型" name="type">
            <Select
              options={[
                { label: "文字", value: "text" },
                { label: "關懷", value: "care" },
                { label: "預約", value: "appointment" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label={
              <div className="flex items-center gap-1">
                <div>內容</div>
                <SyncOutlined
                  style={{ color: "#1677ff" }}
                  className={
                    generating
                      ? "animate-spin size-3 cursor-not-allowed"
                      : "size-3 cursor-pointer"
                  }
                  onClick={generateContent}
                />
              </div>
            }
            name="content"
            rules={[{ required: true, message: "請輸入訊息內容" }]}
          >
            <Input.TextArea showCount rows={10} />
          </Form.Item>

          <Form.Item label="立即傳送" name="sendNow" valuePropName="checked">
            <Checkbox />
          </Form.Item>

          <Form.Item
            label="發送時間"
            name="scheduledDate"
            rules={[{ required: !watchSendNow, message: "請選擇發送時間" }]}
          >
            <DatePicker disabled={watchSendNow} className="w-full" />
          </Form.Item>

          <Form.Item
            label="發送時段"
            name="scheduledTime"
            rules={[{ required: !watchSendNow, message: "請選擇發送時間" }]}
          >
            <Select
              disabled={watchSendNow}
              options={[
                { label: "早上", value: "morning" },
                { label: "下午", value: "afternoon" },
                { label: "晚上", value: "evening" },
              ]}
            />
          </Form.Item>

          <Form.Item label="傳送管道" name="channel">
            <Select
              options={[
                { label: "LINE", value: "line" },
                { label: "Email", value: "email" },
                { label: "SMS", value: "sms" },
                { label: "LINE->Email", value: "line_then_email" },
                { label: "LINE->SMS", value: "line_then_sms" },
                { label: "Email->SMS", value: "email_then_sms" },
              ]}
            />
          </Form.Item>

          <Form.Item label={null}>
            <div className="mt-3 flex justify-end gap-2">
              <Button type="primary" htmlType="submit">
                {watchSendNow ? "發送" : "排程"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
