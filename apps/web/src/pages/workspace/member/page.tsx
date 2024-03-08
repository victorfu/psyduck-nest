import { useWorkspaceData } from "@/hooks/use-root-user";

function WorkspaceMemberPage() {
  const { workspace } = useWorkspaceData();
  return <div>{workspace.name} Members</div>;
}

export default WorkspaceMemberPage;
