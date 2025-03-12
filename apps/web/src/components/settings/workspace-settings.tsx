import { WorkspaceFields, updateWorkspace } from "@/lib/workspace";
import { useRootData, useWorkspaceLoaderData } from "@/hooks/use-data";
import {
  Button,
  Descriptions,
  DescriptionsProps,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Tooltip,
} from "antd";
import { useRevalidator } from "react-router-dom";
import { filterUndefined } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UploadImage } from "../upload-image";
import { DeleteOutlined } from "@ant-design/icons";
import { Timestamp } from "firebase/firestore";

export const WorkspaceSettings = () => {
  const { user } = useRootData();
  const [form] = Form.useForm();
  const { workspace } = useWorkspaceLoaderData();
  const revalidator = useRevalidator();
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

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

  const onFinish = async (values: WorkspaceFields) => {
    if (!user?.uid || !workspace) {
      return;
    }

    const filteredValues = filterUndefined<WorkspaceFields>(values);
    try {
      if (!open) return;
      await updateWorkspace(workspace.id, {
        ...filteredValues,
        updatedAt: Timestamp.fromDate(new Date()),
        updatedBy: user.uid,
      });
      revalidator.revalidate();
      void message.success("更新成功");
      setOpen(false);
    } catch (err) {
      console.error("Failed to update workspace:", err);
      void message.error("更新失敗");
    }
  };

  const handleRemove = async () => {
    if (!user?.uid || !workspace) {
      return;
    }

    try {
      if (!open) return;

      await updateWorkspace(workspace.id, {
        imageUrl: "",
        updatedAt: Timestamp.fromDate(new Date()),
        updatedBy: user.uid,
      });
      revalidator.revalidate();
      void message.success("刪除成功");
      setOpen(false);

      form.setFieldsValue({
        imageUrl: "",
      });
    } catch (err) {
      console.error("Failed to remove workspace image:", err);
      void message.error("刪除失敗");
    }
  };

  const WorkspaceDescription = () => {
    const items: DescriptionsProps["items"] = [
      {
        label: "名稱",
        children: workspace?.name,
      },
      {
        label: "描述",
        span: "filled",
        children: workspace?.description,
      },
      {
        label: "圖片",
        span: "filled",
        children: workspace?.imageUrl && (
          <Flex>
            <img
              src={workspace.imageUrl}
              alt="workspace"
              className="max-h-30"
            />

            {workspace.imageUrl && (
              <Tooltip title="刪除圖片">
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={handleRemove}
                />
              </Tooltip>
            )}
          </Flex>
        ),
      },
    ];

    return <Descriptions bordered title="工作空間資訊" items={items} />;
  };

  return (
    <div className="mt-4">
      <WorkspaceDescription />
      <Button
        color="primary"
        variant="outlined"
        className="mt-2"
        onClick={showModal}
      >
        編輯
      </Button>
      <Modal
        title="工作空間設定"
        footer={null}
        open={open}
        onCancel={handleCancel}
        maskClosable={false}
        forceRender={true}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
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
                更新
              </Button>
              <Button type="default" onClick={handleCancel}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
