import { useTeamLoaderData } from "@/hooks/use-data";
import { Avatar, Button, Input, Space, Table, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import { TeamMember } from "@/lib/api";

const TeamPage = () => {
  const { workspace, teamMembers } = useTeamLoaderData();
  const ownerId = workspace?.createdBy;

  const columns: TableColumnsType<TeamMember> = [
    {
      title: "帳號",
      dataIndex: "email",
      render: (email: string, record: TeamMember) => {
        const { photoURL } = record;
        return (
          <div className="flex items-center gap-2">
            <Avatar src={photoURL} />
            <span>{email}</span>
            {ownerId === record.uid && <Tag color="blue">Owner</Tag>}
          </div>
        );
      },
      width: 240,
    },
    {
      title: "姓名",
      dataIndex: "displayName",
    },
    {
      title: "操作",
      render: (record: TeamMember) => {
        const { uid } = record;
        const isOwner = uid === ownerId;
        if (isOwner) {
          return null;
        }
        return (
          <Button
            type="text"
            danger
            onClick={() => {
              console.log(record);
            }}
          >
            <DeleteOutlined />
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <Space direction="horizontal">
          <Input placeholder="輸入Email帳號" style={{ width: 300 }} />
          <Button
            onClick={() => {
              // TODO: send invitation
            }}
          >
            邀請
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={teamMembers?.map((user) => ({
          ...user,
          key: user.uid,
        }))}
      />
    </div>
  );
};

export default TeamPage;
