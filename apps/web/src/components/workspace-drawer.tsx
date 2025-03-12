import { Drawer, Popconfirm } from "antd";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useEffect } from "react";
import { UploadImage } from "./upload-image";
import { Workspace, WorkspaceFields } from "@/lib/workspace";

interface WorkspaceDrawerProps {
  workspace: Workspace | null;
  open: boolean;
  onClose?: () => void;
  onFinish?: FormProps<WorkspaceFields>["onFinish"];
  onFinishFailed?: FormProps<WorkspaceFields>["onFinishFailed"];
  onDelete?: () => void;
}

export const WorkspaceDrawer = ({
  workspace,
  open,
  onClose,
  onFinish,
  onFinishFailed,
  onDelete,
}: WorkspaceDrawerProps) => {
  const [form] = Form.useForm();
  const title = workspace ? "編輯工作空間" : "新增工作空間";

  useEffect(() => {
    if (open && workspace) {
      form.setFieldsValue({
        name: workspace.name,
        description: workspace.description,
        imageUrl: workspace.imageUrl,
      });
    }
  }, [workspace, form, open]);

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  return (
    <Drawer
      title={title}
      onClose={onClose}
      open={open}
      forceRender
      maskClosable={false}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        preserve={false}
      >
        <Form.Item<WorkspaceFields>
          label="名稱"
          name="name"
          rules={[{ required: true, message: "請輸入工作空間名稱!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<WorkspaceFields> label="描述" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item<WorkspaceFields> label="圖片" name="imageUrl">
          <UploadImage />
        </Form.Item>

        <Form.Item label={null}>
          <div className="flex justify-end gap-2">
            <Button type="primary" htmlType="submit">
              {workspace ? "更新" : "新增"}
            </Button>
            {workspace && (
              <Popconfirm
                title="確認要移除嗎？"
                onConfirm={onDelete}
                okText="確認"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button type="default" danger>
                  移除
                </Button>
              </Popconfirm>
            )}
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
