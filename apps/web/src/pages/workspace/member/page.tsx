import { useWorkspaceData } from "@/hooks/use-root-user";
import Api from "@/lib/api";
import { useEffect, useState } from "react";
import MemberTable from "./member-table";

function WorkspaceMemberPage() {
  const { workspace } = useWorkspaceData();
  const [members, setMembers] = useState<WorkspaceAccess[]>([]);

  useEffect(() => {
    if (!workspace) {
      return;
    }

    Api.getWorkspaceMembers(workspace.id)
      .then((data) => {
        setMembers(data);
      })
      .catch(console.error);
  }, [workspace]);

  return (
    <div>
      <div>{workspace.name}</div>
      <MemberTable members={members} />
    </div>
  );
}

export default WorkspaceMemberPage;
