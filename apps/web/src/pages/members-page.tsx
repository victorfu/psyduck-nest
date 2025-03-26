import { useState } from "react";
import { Button, message, Table, Typography } from "antd";
import {
  addMember,
  batchAddMembers,
  deleteMember,
  getMember,
  MemberWithLineUser,
  updateMember,
  MemberFields,
} from "@/lib/member";
import { useMembersLoaderData, useRootData } from "@/hooks/use-data";
import { MemberDrawer } from "@/components/member/member-drawer";
import { EditOutlined } from "@ant-design/icons";
import { filterUndefinedAndTrim } from "@/lib/utils";
import { useParams, useRevalidator } from "react-router-dom";
import { MessageForm, MessageFormFields } from "@/components/message-form";
import { ImportMemberButton } from "@/components/member/import-member-button";
import { getLineUserByMemberId } from "@/lib/line-users";
import { addMessageSchedule, MessageSchedule } from "@/lib/message-schedule";
import { Timestamp } from "firebase/firestore";

interface MemberTableDataType extends MemberWithLineUser {
  key: string;
}

const MembersPage = () => {
  const { user } = useRootData();
  const { workspaceId } = useParams();
  const { members } = useMembersLoaderData();
  const revalidator = useRevalidator();

  const [selectedMember, setSelectedMember] =
    useState<MemberTableDataType | null>(null);
  const [open, setOpen] = useState(false);

  const edit = (record: MemberTableDataType) => {
    setSelectedMember(record);
    setOpen(true);
  };

  const handleCancel = () => {
    setSelectedMember(null);
    setOpen(false);
  };

  const handleFinish = async (values: MemberFields) => {
    if (!user?.uid || !workspaceId) {
      return;
    }

    const filteredValues = filterUndefinedAndTrim<MemberFields>(values);
    try {
      const now = new Date();
      const timestamp = Timestamp.fromDate(now);
      if (selectedMember) {
        await updateMember(selectedMember.id, {
          ...filteredValues,
          updatedAt: timestamp,
          updatedBy: user.uid,
        });
      } else {
        await addMember({
          ...filteredValues,
          createdAt: timestamp,
          createdBy: user.uid,
          updatedAt: timestamp,
          updatedBy: user.uid,
          workspaceIds: [workspaceId],
        });
      }
      revalidator.revalidate();
      setSelectedMember(null);
      setOpen(false);
      void message.success("新增成功");
    } catch (err) {
      console.error("Failed to save member:", err);
      void message.error("新增失敗");
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) {
      return;
    }
    try {
      await deleteMember(selectedMember);
      revalidator.revalidate();
      setSelectedMember(null);
      setOpen(false);
      void message.success("刪除成功");
    } catch (err) {
      console.error("Failed to delete member:", err);
      void message.error("刪除失敗");
    }
  };

  const handleImportSuccess = async (members: MemberFields[]) => {
    if (!user?.uid || !workspaceId) {
      return;
    }

    try {
      const now = new Date();
      const timestamp = Timestamp.fromDate(now);
      const membersWithUids = members.map((member) => ({
        ...member,
        createdAt: timestamp,
        createdBy: user.uid,
        updatedAt: timestamp,
        updatedBy: user.uid,
        workspaceIds: [workspaceId],
      }));

      await batchAddMembers(membersWithUids);
      revalidator.revalidate();
      void message.success("匯入成功");
    } catch (error) {
      console.error("Failed to import members:", error);
      void message.error("匯入失敗");
    }
  };

  const scheduleMessage = async (
    memberId: string,
    workspaceId: string,
    m: MessageFormFields,
  ) => {
    if (!workspaceId || !memberId || !m.content || !user?.uid) {
      throw new Error("參數錯誤");
    }

    const member = await getMember(memberId);
    if (!member) {
      throw new Error("成員不存在");
    }

    const lineUser = await getLineUserByMemberId(workspaceId, memberId);
    const channel = m.channel;
    if (channel === "line") {
      if (!lineUser) {
        throw new Error("Line 用戶不存在");
      }
    } else if (channel === "email") {
      const email = member.email;
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error("Email 格式錯誤");
      }
    } else if (channel === "sms") {
      const phone = member.phone;
      if (!phone.match(/^[0-9]{10}$/)) {
        throw new Error("電話格式錯誤");
      }
    } else {
      throw new Error("傳送管道錯誤");
    }

    const now = new Date();
    const timestamp = Timestamp.fromDate(now);
    const scheduledDate = m.scheduledDate?.toDate();

    const newM = {
      ...m,
      scheduledDate: scheduledDate
        ? Timestamp.fromDate(scheduledDate)
        : undefined,
    };
    const messageSchedule: MessageSchedule = {
      memberId,
      recipient: {
        name: member.name,
        line: lineUser?.lineUserId,
        email: member.email,
        phone: member.phone,
      },
      workspaceId,
      message: newM,
      status: "pending",
      processed: false,
      createdAt: timestamp,
      createdBy: user.uid,
      updatedAt: timestamp,
      updatedBy: user.uid,
    };

    const ms = {
      ...messageSchedule,
      message: filterUndefinedAndTrim(messageSchedule.message),
      recipient: filterUndefinedAndTrim(messageSchedule.recipient),
    };
    await addMessageSchedule(ms);
  };

  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      width: "15%",
      render: (_: unknown, record: MemberTableDataType) => {
        return (
          <Typography.Link
            disabled={!!selectedMember}
            onClick={() => edit(record)}
          >
            {record.name}
          </Typography.Link>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
    },
    {
      title: "電話",
      dataIndex: "phone",
      width: "20%",
    },
    {
      title: "LINE",
      dataIndex: "lineUser",
      render: (_: unknown, record: MemberTableDataType) => {
        if (!record.lineUser) {
          return "未綁定";
        }
        return (
          <div className="flex items-center gap-2">
            <img
              src={record.lineUser?.pictureUrl}
              className="size-10 rounded-full"
            />
            <div>
              <div title={record.lineUser?.lineUserId}>
                {record.lineUser?.displayName}
              </div>
              <div className="text-green-500">已綁定</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "operation",
      width: "8%",
      render: (_: unknown, record: MemberTableDataType) => {
        return (
          <div className="flex gap-2">
            <Typography.Link
              disabled={!!selectedMember}
              onClick={() => edit(record)}
            >
              <EditOutlined />
            </Typography.Link>
            <MessageForm
              onSubmit={(m: MessageFormFields) => {
                if (!workspaceId || !record.id) {
                  void message.error("請選擇成員");
                  return;
                }
                try {
                  void scheduleMessage(record.id, workspaceId, m);
                  void message.success("排程成功");
                } catch (error) {
                  console.error("Failed to schedule message:", error);
                  if (error instanceof Error) {
                    void message.error(`排程失敗: ${error.message}`);
                  } else {
                    void message.error("排程失敗");
                  }
                }
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="primary"
          onClick={() => {
            setSelectedMember(null);
            setOpen(true);
          }}
        >
          新增
        </Button>
        <ImportMemberButton onImportSuccess={handleImportSuccess} />
      </div>
      <Table<MemberTableDataType>
        bordered
        dataSource={members?.map((m) => ({ ...m, key: m.id })) ?? []}
        columns={columns}
        pagination={{ onChange: handleCancel }}
      />
      <MemberDrawer
        open={open}
        member={selectedMember}
        onClose={handleCancel}
        onFinish={handleFinish}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MembersPage;
