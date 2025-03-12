import { useDashboardLoaderData } from "@/hooks/use-data";
import { Card, List } from "antd";

const DashboardPage = () => {
  const { memberCount, lineUserCount } = useDashboardLoaderData();

  const data = [
    {
      title: "成員數量",
      value: memberCount,
    },
    {
      title: "LINE用戶數量",
      value: lineUserCount,
    },
  ];

  return (
    <div>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.title}>{item.value}</Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default DashboardPage;
