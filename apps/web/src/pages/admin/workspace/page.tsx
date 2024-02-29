import { useLoaderData } from "react-router-dom";
import { WorkspaceTable } from "./workspace-table";
import AdminLayout from "../admin-layout";

function WorkspacePage() {
  const { workspaces } = useLoaderData() as { workspaces: Workspace[] };

  return (
    <AdminLayout>
      <WorkspaceTable workspaces={workspaces} />
    </AdminLayout>
  );
}

export default WorkspacePage;
