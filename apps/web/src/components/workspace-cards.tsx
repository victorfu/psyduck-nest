import React from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Card, Flex, Dropdown, Tooltip } from "antd";
import { Workspace } from "@/lib/workspace";
import { useNavigate } from "react-router-dom";
// import placeholder from "@/assets/placeholder.svg";

export const WorkspaceCards = ({
  workspaces,
  onEditClick,
}: {
  workspaces: Workspace[];
  onEditClick?: (workspace: Workspace) => void;
}) => {
  const navigate = useNavigate();
  const handleMenuClick = (key: string, workspace: Workspace) => {
    switch (key) {
      case "switch":
        navigate(`/workspace/${workspace.id}/workspaces`);
        break;
      default:
        break;
    }
  };

  const createActions: (workspace: Workspace) => React.ReactNode[] = (
    workspace,
  ) => {
    return [
      <Tooltip title="切換工作空間">
        <SwapOutlined
          key="switch"
          onClick={() => handleMenuClick("switch", workspace)}
        />
      </Tooltip>,
      <Dropdown
        key="more"
        menu={{
          items: [
            {
              key: "edit",
              icon: <EditOutlined />,
              label: "編輯",
              onClick: () => onEditClick?.(workspace),
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
          // cover={
          //   <img
          //     alt={workspace.name}
          //     src={
          //       workspace.imageUrl && workspace.imageUrl !== ""
          //         ? workspace.imageUrl
          //         : placeholder
          //     }
          //     className="w-full h-[150px] object-cover"
          //   />
          // }
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
