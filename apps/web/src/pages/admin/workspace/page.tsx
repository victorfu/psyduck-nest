import { useLoaderData } from "react-router-dom";
import { WorkspaceTable } from "./workspace-table";
import CheckAdmin from "../check-admin";

function AdminWorkspacePage() {
  const { workspaces } = useLoaderData() as { workspaces: Workspace[] };

  return (
    <CheckAdmin>
      <WorkspaceTable workspaces={workspaces} />
    </CheckAdmin>
  );
}

export default AdminWorkspacePage;
