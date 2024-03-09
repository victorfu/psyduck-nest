import { useWorkspaceData } from "@/hooks/use-root-user";

function WorkspaceSettingsPage() {
  const { workspace } = useWorkspaceData();
  return <div>{workspace.name} Settings</div>;
}

export default WorkspaceSettingsPage;
