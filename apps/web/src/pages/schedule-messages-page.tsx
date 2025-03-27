import { Table } from "antd";
import { useScheduleMessagesLoaderData } from "@/hooks/use-data";
import { MessageSchedule, Recipient } from "@/lib/message-schedule";
import dayjs from "dayjs";
import { Timestamp } from "firebase/firestore";

interface ScheduleMessagesTableDataType extends MessageSchedule {
  key: string;
}

const ScheduleMessagesPage = () => {
  const { messageSchedules } = useScheduleMessagesLoaderData();

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "用戶名稱",
      dataIndex: "recipient",
      render: (recipient: Recipient) => {
        return <div>{recipient.name}</div>;
      },
    },
    {
      title: "狀態",
      dataIndex: "status",
    },
    {
      title: "頻道",
      dataIndex: "message",
      render: (_: unknown, record: MessageSchedule) => {
        return <div>{record.message.channel}</div>;
      },
    },
    {
      title: "訊息",
      dataIndex: "message",
      render: (_: unknown, record: MessageSchedule) => {
        return <div>{record.message.content}</div>;
      },
    },
    {
      title: "建立時間",
      dataIndex: "createdAt",
      render: (createdAt: Timestamp) => {
        return (
          <div>{dayjs(createdAt.toDate()).format("YYYY-MM-DD HH:mm:ss")}</div>
        );
      },
    },
    {
      title: "排程時間",
      dataIndex: "message",
      render: (_: unknown, record: MessageSchedule) => {
        if (record.message.sendNow) {
          return <div>立即傳送</div>;
        }

        const scheduledDate = record.message.scheduledDate as Timestamp;
        const scheduledTime = record.message.scheduledTime;

        if (!scheduledDate || !scheduledTime) {
          return "排程時間未設定";
        }

        let timeText = "";
        if (scheduledTime === "morning") {
          timeText = "早上";
        } else if (scheduledTime === "afternoon") {
          timeText = "下午";
        } else if (scheduledTime === "evening") {
          timeText = "晚上";
        }

        return (
          <div>
            {dayjs(scheduledDate.toDate()).format("YYYY-MM-DD")} {timeText}
          </div>
        );
      },
    },
    {
      title: "傳送時間",
      dataIndex: "sentAt",
      render: (sentAt: Timestamp) => {
        if (!sentAt) {
          return <div>未傳送</div>;
        }
        return (
          <div>{dayjs(sentAt.toDate()).format("YYYY-MM-DD HH:mm:ss")}</div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <Table<ScheduleMessagesTableDataType>
        bordered
        dataSource={
          messageSchedules?.map((messageSchedule, idx) => ({
            ...messageSchedule,
            key: idx.toString(),
          })) ?? []
        }
        columns={columns}
        rowClassName="editable-row"
      />
    </div>
  );
};

export default ScheduleMessagesPage;
