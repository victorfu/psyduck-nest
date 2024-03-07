import { useLoaderData } from "react-router-dom";

function WorkspaceDetailPage() {
  const { workspace } = useLoaderData() as {
    workspace: Workspace;
  };

  return <div>{workspace.name}</div>;
}

export default WorkspaceDetailPage;
