import React from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Card, Flex, Dropdown } from "antd";
import placeholder from "@/assets/placeholder.svg";
import { Workspace } from "@/lib/workspace";

export const WorkspaceCards = ({
  workspaces,
  onEditClick,
}: {
  workspaces: Workspace[];
  onEditClick?: (workspace: Workspace) => void;
}) => {
  const handleMenuClick = (key: string, workspace: Workspace) => {
    switch (key) {
      case "details":
        // Handle view details action
        console.log("View details for workspace:", workspace);
        break;
      default:
        break;
    }
  };

  const createActions: (workspace: Workspace) => React.ReactNode[] = (
    workspace,
  ) => {
    return [
      <EditOutlined key="edit" onClick={() => onEditClick?.(workspace)} />,
      <Dropdown
        key="more"
        menu={{
          items: [
            {
              key: "details",
              icon: <InfoCircleOutlined />,
              label: "查看詳細資訊",
              onClick: () => handleMenuClick("details", workspace),
            },
          ],
        }}
        trigger={["click"]}
      >
        <EllipsisOutlined key="ellipsis" />
      </Dropdown>,
    ];
  };

  return (
    <Flex
      gap="middle"
      align="start"
      wrap="wrap"
      className="w-full justify-center sm:justify-start"
    >
      {workspaces.map((workspace) => (
        <Card
          key={workspace.id}
          cover={
            <img
              alt={workspace.name}
              src={
                workspace.imageUrl && workspace.imageUrl !== ""
                  ? workspace.imageUrl
                  : placeholder
              }
              className="w-full h-[150px] object-cover"
            />
          }
          actions={createActions(workspace)}
          className="w-full sm:w-[250px]"
        >
          <Card.Meta
            title={workspace.name}
            description={
              <div
                title={workspace.description}
                className="whitespace-nowrap text-ellipsis overflow-hidden h-[22px]"
              >
                {workspace.description}
              </div>
            }
          />
        </Card>
      ))}
    </Flex>
  );
};
