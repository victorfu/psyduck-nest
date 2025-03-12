import { useRootData } from "@/hooks/use-data";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { AccountSettings } from "@/components/settings/account-settings";
import { GoogleSettings } from "@/components/settings/google-settings";
import { LineSettings } from "@/components/settings/line-settings";
import { WorkspaceSettings } from "@/components/settings/workspace-settings";

const SettingsPage = () => {
  const { user } = useRootData();
  const { workspaceId } = useParams();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const items: TabsProps["items"] = [
    {
      key: "account",
      label: "帳號",
      children: <AccountSettings user={user} />,
    },
    {
      key: "workspace",
      label: "工作空間",
      children: <WorkspaceSettings />,
    },
    {
      key: "line",
      label: "LINE",
      children: <LineSettings />,
    },
    {
      key: "google",
      label: "Google",
      children: <GoogleSettings />,
    },
  ];

  const onChange = (key: string) => {
    navigate(`/workspace/${workspaceId}/settings?tab=${key}`);
  };

  return (
    <div>
      <Tabs
        defaultActiveKey={tab ?? "account"}
        items={items}
        onChange={onChange}
      />
    </div>
  );
};

export default SettingsPage;
