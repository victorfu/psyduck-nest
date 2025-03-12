import { MemberFields } from "@/lib/member";
import { Member } from "@/lib/member";
import { Drawer, Popconfirm } from "antd";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import { useEffect } from "react";

interface MemberDrawerProps {
  member: Member | null;
  open: boolean;
  onClose?: () => void;
  onFinish?: FormProps<MemberFields>["onFinish"];
  onFinishFailed?: FormProps<MemberFields>["onFinishFailed"];
  onDelete?: () => void;
}

export const MemberDrawer = ({
  member,
  open,
  onClose,
  onFinish,
  onFinishFailed,
  onDelete,
}: MemberDrawerProps) => {
  const [form] = Form.useForm();
  const title = member ? "編輯成員" : "新增成員";

  useEffect(() => {
    if (open && member) {
      form.setFieldsValue({
        name: member.name,
        email: member.email,
        phone: member.phone,
      });
    }
  }, [member, form, open]);

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
        initialValues={{
          name: member?.name ?? "",
          email: member?.email ?? "",
          phone: member?.phone ?? "",
        }}
      >
        <Form.Item<MemberFields>
          label="姓名"
          name="name"
          rules={[{ required: true, message: "請輸入姓名!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<MemberFields> label="Email" name="email">
          <Input />
        </Form.Item>

        <Form.Item<MemberFields> name="phone" label="電話">
          <Input />
        </Form.Item>

        <Form.Item label={null}>
          <div className="flex justify-end gap-2">
            <Button type="primary" htmlType="submit">
              {member ? "更新" : "新增"}
            </Button>
            {member && (
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
