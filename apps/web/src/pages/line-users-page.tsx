import { Table } from "antd";
import { useLineUsersLoaderData } from "@/hooks/use-data";
import { LineUser } from "@/lib/line-users";

interface LineUserTableDataType extends LineUser {
  key: string;
}

const LineUsersPage = () => {
  const { lineUsers } = useLineUsersLoaderData();
  const columns = [
    {
      title: "用戶名稱",
      dataIndex: "displayName",
      render: (displayName: string, record: LineUserTableDataType) => {
        const { lineUserId, pictureUrl } = record;

        return (
          <div className="flex items-center gap-2" title={lineUserId}>
            <img
              src={pictureUrl}
              alt="user"
              className="w-10 h-10 rounded-full"
            />
            {displayName}
          </div>
        );
      },
    },
    {
      title: "狀態",
      dataIndex: "isFollowing",
      render: (isFollowing: boolean) => {
        return isFollowing ? (
          <div className="text-green-500">已加入好友</div>
        ) : (
          <div className="text-red-500">封鎖</div>
        );
      },
    },
    {
      title: "綁定電話號碼",
      dataIndex: "phone",
    },
  ];

  return (
    <div className="space-y-4">
      <Table<LineUserTableDataType>
        bordered
        dataSource={lineUsers?.map((lineUser) => ({
          ...lineUser,
          key: lineUser.lineUserId,
        }))}
        columns={columns}
        scroll={{
          scrollToFirstRowOnChange: false,
        }}
      />
    </div>
  );
};

export default LineUsersPage;
