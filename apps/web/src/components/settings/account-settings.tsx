import { User } from "firebase/auth";
import { format } from "date-fns";
import { Descriptions } from "antd";
import type { DescriptionsProps } from "antd";

export const AccountSettings = ({ user }: { user: User | null }) => {
  const items: DescriptionsProps["items"] = [
    {
      label: "帳號",
      children: user?.email,
    },
    {
      label: "創建時間",
      span: "filled", // span = 2
      children: user?.metadata.creationTime
        ? format(user.metadata.creationTime, "yyyy-MM-dd HH:mm:ss")
        : "",
    },
    {
      label: "上次登入",
      span: "filled", // span = 3
      children: user?.metadata.lastSignInTime
        ? format(user.metadata.lastSignInTime, "yyyy-MM-dd HH:mm:ss")
        : "",
    },
  ];

  return (
    <div className="mt-4">
      <Descriptions bordered title="帳號資訊" items={items} />
    </div>
  );
};
