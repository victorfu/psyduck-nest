import {
  User,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { format } from "date-fns";
import {
  Descriptions,
  Button,
  Modal,
  Form,
  Input,
  message,
  Flex,
  Tooltip,
} from "antd";
import type { DescriptionsProps } from "antd";
import { updateUserProfile } from "@/lib/firebase";
import { useRevalidator } from "react-router-dom";
import { useEffect, useState } from "react";
import { filterUndefined } from "@/lib/utils";
import { UploadImage } from "../upload-image";
import { DeleteOutlined } from "@ant-design/icons";

type UserFields = Pick<User, "displayName" | "photoURL" | "email">;

export const AccountSettings = ({ user }: { user: User | null }) => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const revalidator = useRevalidator();
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    if (profileOpen && user) {
      profileForm.setFieldsValue({
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
      });
    }
  }, [user, profileForm, profileOpen]);

  useEffect(() => {
    if (passwordOpen && user) {
      passwordForm.setFieldsValue({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user, passwordForm, passwordOpen]);

  const showProfileModal = () => {
    setProfileOpen(true);
  };

  const handleProfileCancel = () => {
    setProfileOpen(false);
  };

  const showPasswordModal = () => {
    setPasswordOpen(true);
  };

  const handlePasswordCancel = () => {
    setPasswordOpen(false);
  };

  const onProfileFormFinish = async (values: UserFields) => {
    if (!user?.uid) {
      return;
    }

    const filteredValues = filterUndefined<UserFields>(values);
    try {
      if (!profileOpen) return;

      const data: { displayName?: string; photoURL?: string } = {};
      if (filteredValues.displayName) {
        data.displayName = filteredValues.displayName;
      }
      if (filteredValues.photoURL) {
        data.photoURL = filteredValues.photoURL;
      }
      await updateUserProfile(user, data);
      revalidator.revalidate();
      void message.success("更新成功");
      setProfileOpen(false);
    } catch (err) {
      console.error("Failed to update user displayName:", err);
      void message.error("更新失敗");
    }
  };

  const onPhotoRemove = async () => {
    if (!user?.uid) {
      return;
    }

    try {
      await updateUserProfile(user, {
        photoURL: "",
      });
      revalidator.revalidate();
      void message.success("刪除成功");
      setProfileOpen(false);

      profileForm.setFieldsValue({
        photoURL: "",
      });
    } catch (err) {
      console.error("Failed to remove user photoURL:", err);
      void message.error("刪除失敗");
    }
  };

  const onPasswordFormFinish = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (!user?.uid || !user?.email) {
      return;
    }

    const { oldPassword, newPassword, confirmPassword } = values;

    if (newPassword !== confirmPassword) {
      void message.error("新密碼與確認密碼不一致");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      void message.success("更新密碼成功");
      setPasswordOpen(false);
    } catch (err) {
      console.error("Failed to update user password:", err);
      void message.error("更新密碼失敗");
    }
  };

  const items: DescriptionsProps["items"] = [
    {
      label: "帳號",
      children: user?.email,
    },
    {
      label: "姓名",
      span: "filled",
      children: user?.displayName,
    },
    {
      label: "創建時間",
      children: user?.metadata.creationTime
        ? format(user.metadata.creationTime, "yyyy-MM-dd HH:mm:ss")
        : "",
    },
    {
      label: "上次登入",
      span: "filled",
      children: user?.metadata.lastSignInTime
        ? format(user.metadata.lastSignInTime, "yyyy-MM-dd HH:mm:ss")
        : "",
    },
    {
      label: "頭像",
      span: "filled",
      children: user?.photoURL && (
        <Flex>
          <img
            src={user.photoURL}
            alt="user"
            className="max-h-30 rounded-full"
          />

          {user.photoURL && (
            <Tooltip title="刪除頭像">
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                onClick={onPhotoRemove}
              />
            </Tooltip>
          )}
        </Flex>
      ),
    },
  ];

  const isGoogleLogin = user?.providerData.some(
    (provider) => provider.providerId === "google.com",
  );

  return (
    <div className="mt-4">
      <Descriptions bordered title="帳號資訊" items={items} />
      <div className="flex gap-2">
        <Button
          color="primary"
          variant="outlined"
          className="mt-2"
          onClick={showProfileModal}
        >
          編輯
        </Button>

        {!isGoogleLogin && (
          <Button
            color="danger"
            variant="outlined"
            className="mt-2"
            onClick={showPasswordModal}
          >
            修改密碼
          </Button>
        )}
      </div>

      <Modal
        title="帳號設定"
        footer={null}
        open={profileOpen}
        onCancel={handleProfileCancel}
        maskClosable={false}
        forceRender={true}
      >
        <Form
          form={profileForm}
          name="account-settings-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={onProfileFormFinish}
          autoComplete="off"
          preserve={false}
        >
          <Form.Item<UserFields> label="帳號" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item<UserFields>
            label="姓名"
            name="displayName"
            rules={[{ required: true, message: "請輸入姓名!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<UserFields> label="頭像" name="photoURL">
            <UploadImage />
          </Form.Item>

          <Form.Item label={null}>
            <div className="flex justify-end gap-2">
              <Button type="primary" htmlType="submit">
                更新
              </Button>
              <Button type="default" onClick={handleProfileCancel}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="修改密碼"
        footer={null}
        open={passwordOpen}
        onCancel={handlePasswordCancel}
      >
        <Form
          form={passwordForm}
          name="password-form"
          onFinish={onPasswordFormFinish}
        >
          <Form.Item
            label="輸入舊密碼"
            name="oldPassword"
            rules={[{ required: true, message: "請輸入舊密碼!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="輸入新密碼"
            name="newPassword"
            rules={[{ required: true, message: "請輸入新密碼!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="確認新密碼"
            name="confirmPassword"
            rules={[{ required: true, message: "請輸入確認密碼!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <div className="flex justify-end gap-2">
              <Button type="primary" htmlType="submit">
                修改
              </Button>
              <Button type="default" onClick={handlePasswordCancel}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
