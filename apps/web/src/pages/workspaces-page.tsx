import { useEffect, useState, useRef } from "react";
import { Button, FloatButton, Modal, Progress } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  addWorkspace,
  bulkSetWorkspaces,
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
import { CloudSyncOutlined, DatabaseOutlined } from "@ant-design/icons";
import { getCpWorkspaces } from "@/lib/api";

const SyncModal = ({
  open,
  onCancel,
}: {
  open: boolean;
  onCancel: () => void;
}) => {
  const { user } = useRootData();
  const { workspaces } = useWorkspacesLoaderDataWithId();
  const [progress, setProgress] = useState(0);
  const syncInProgress = useRef<boolean>(false);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    setStatus("");

    return () => {
      syncInProgress.current = false;
    };
  }, []);

  const onSync = async () => {
    console.log(workspaces);
    if (!user?.uid) {
      return;
    }
    if (syncInProgress.current) {
      return;
    }

    const cpWorkspaces = await getCpWorkspaces();
    if (!cpWorkspaces) {
      void message.error("無法取得CP工作空間");
      return;
    }

    setStatus(`同步 ${cpWorkspaces.length} 個CP工作空間`);

    syncInProgress.current = true;
    setProgress(0);

    const workspacesToAdd = [];
    for (let index = 0; index < cpWorkspaces.length; index++) {
      const workspace = cpWorkspaces[index];
      const strId = workspace.id.toString();
      const found = workspaces?.find((w) => w.id === strId);
      if (found) {
        continue;
      }

      const now = new Date();
      const timestamp = Timestamp.fromDate(now);
      workspacesToAdd.push({
        id: strId,
        name: workspace.name,
        description: "",
        createdAt: timestamp,
        createdBy: user?.uid,
        updatedAt: timestamp,
        updatedBy: user?.uid,
        uids: [user?.uid],
      });

      const p = Math.floor(((index + 1) / cpWorkspaces.length) * 90);
      setProgress(p);
    }

    if (workspacesToAdd.length > 0) {
      await bulkSetWorkspaces(workspacesToAdd);
      setProgress(100);
    } else {
      setStatus("沒有新增的CP工作空間");
    }

    syncInProgress.current = false;
  };

  return (
    <Modal
      open={open}
      onCancel={syncInProgress.current ? undefined : onCancel}
      maskClosable={false}
      destroyOnClose
      footer={null}
    >
      <div className="flex items-center gap-2">
        <Button
          type="primary"
          onClick={onSync}
          disabled={syncInProgress.current}
        >
          開始同步
        </Button>
        <div className="text-sm text-gray-500">{status}</div>
      </div>
      <Progress percent={progress} />
    </Modal>
  );
};

const WorkspacesPage = () => {
  const { user } = useRootData();
  const { workspaces } = useWorkspacesLoaderDataWithId();
  const revalidator = useRevalidator();

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(
    null,
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openGroup, setOpenGroup] = useState(false);
  const [openSyncModal, setOpenSyncModal] = useState(false);

  const editWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setOpenDrawer(true);
  };

  const handleCancel = () => {
    setSelectedWorkspace(null);
    setOpenDrawer(false);
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
          uids: [user.uid],
        });
      }
      setSelectedWorkspace(null);
      setOpenDrawer(false);

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
      await deleteWorkspace(selectedWorkspace);
      setSelectedWorkspace(null);
      setOpenDrawer(false);

      revalidator.revalidate();
      void message.success("刪除成功");
    } catch (err) {
      console.error("Failed to delete workspace:", err);
      void message.error("刪除失敗，若有會員則無法刪除");
    }
  };

  return (
    <div className="space-y-4">
      <FloatButton.Group
        type="primary"
        open={openGroup}
        trigger="click"
        icon={<PlusOutlined />}
        onClick={() => {
          setOpenGroup((prev) => !prev);
        }}
      >
        <FloatButton
          tooltip="新增"
          icon={
            <DatabaseOutlined
              onClick={() => {
                setSelectedWorkspace(null);
                setOpenDrawer(true);
              }}
            />
          }
        />
        <FloatButton
          tooltip="同步"
          icon={<CloudSyncOutlined />}
          onClick={() => {
            setOpenSyncModal(true);
          }}
        />
      </FloatButton.Group>

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
        open={openDrawer}
        workspace={selectedWorkspace}
        onClose={handleCancel}
        onFinish={handleFinish}
        onDelete={handleDelete}
      />
      <SyncModal
        open={openSyncModal}
        onCancel={() => setOpenSyncModal(false)}
      />
    </div>
  );
};

export default WorkspacesPage;
