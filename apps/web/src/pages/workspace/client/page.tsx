import { useWorkspaceData } from "@/hooks/use-root-user";

function WorkspaceClientPage() {
  const { workspace } = useWorkspaceData();
  return <div>{workspace.name} Clients</div>;
}

export default WorkspaceClientPage;
