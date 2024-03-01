import { useLoaderData } from "react-router-dom";
import { WorkspaceTable } from "./workspace-table";
import CheckAdmin from "../check-admin";

function WorkspacePage() {
  const { workspaces } = useLoaderData() as { workspaces: Workspace[] };

  return (
    <CheckAdmin>
      <WorkspaceTable workspaces={workspaces} />
    </CheckAdmin>
  );
}

export default WorkspacePage;
