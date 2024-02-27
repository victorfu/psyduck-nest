import { useLoaderData } from "react-router-dom";
import { WorkspaceTable } from "./workspace-table";

function WorkspacePage() {
  const { workspaces } = useLoaderData() as { workspaces: Workspace[] };

  return (
    <div>
      <WorkspaceTable workspaces={workspaces} />
    </div>
  );
}

export default WorkspacePage;
