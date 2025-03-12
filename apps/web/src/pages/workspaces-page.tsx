import { useState } from "react";
import { FloatButton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  addWorkspace,
  deleteWorkspace,
  updateWorkspace,
  Workspace,
  WorkspaceFields,
} from "@/lib/workspace";
import { useRootData, useWorkspacesLoaderDataWithId } from "@/hooks/use-data";
import { WorkspaceDrawer } from "@/components/workspace-drawer";
import { filterUndefinedAndTrim } from "@/lib/utils";
import { useRevalidator } from "react-router-dom";
import { message } from "antd";
import { WorkspaceCards } from "@/components/workspace-cards";
import { Timestamp } from "firebase/firestore";

const WorkspacesPage = () => {
  const { user } = useRootData();
  const { workspaces } = useWorkspacesLoaderDataWithId();
  const revalidator = useRevalidator();

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  );
  const [open, setOpen] = useState(false);

  const editWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setOpen(true);
  };

  const handleCancel = () => {
    setSelectedWorkspace(null);
    setOpen(false);
  };

  const handleFinish = async (values: WorkspaceFields) => {
    if (!user?.uid) {
      return;
    }

    const filteredValues = filterUndefinedAndTrim<WorkspaceFields>(values);
    try {
      const now = new Date();
      const timestamp = Timestamp.fromDate(now);
      if (selectedWorkspace) {
        await updateWorkspace(selectedWorkspace.id, {
          ...filteredValues,
          updatedAt: timestamp,
          updatedBy: user.uid,
        });
      } else {
        await addWorkspace({
          ...filteredValues,
          createdAt: timestamp,
          createdBy: user.uid,
          updatedAt: timestamp,
          updatedBy: user.uid,
          uids: { [user.uid]: true },
        });
      }
      setSelectedWorkspace(null);
      setOpen(false);

      revalidator.revalidate();
      void message.success("新增成功");
    } catch (err) {
      console.error("Failed to add/update workspace:", err);
      void message.error("新增失敗");
    }
  };

  const handleDelete = async () => {
    if (!selectedWorkspace) {
      return;
    }

    if (selectedWorkspace.createdBy !== user?.uid) {
      void message.error("你不是此工作空間的建立者，無法刪除");
      return;
    }

    try {
      await deleteWorkspace(user.uid, selectedWorkspace);
      setSelectedWorkspace(null);
      setOpen(false);

      revalidator.revalidate();
      void message.success("刪除成功");
    } catch (err) {
      console.error("Failed to delete workspace:", err);
      void message.error("刪除失敗，若有會員則無法刪除");
    }
  };

  return (
    <div className="space-y-4">
      <FloatButton
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setSelectedWorkspace(null);
          setOpen(true);
        }}
      />
      <WorkspaceCards
        workspaces={
          workspaces
            ? workspaces.map((workspace) => ({
                ...workspace,
                key: workspace.id,
              }))
            : []
        }
        onEditClick={(workspace) => editWorkspace(workspace)}
      />
      <WorkspaceDrawer
        open={open}
        workspace={selectedWorkspace}
        onClose={handleCancel}
        onFinish={handleFinish}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default WorkspacesPage;
