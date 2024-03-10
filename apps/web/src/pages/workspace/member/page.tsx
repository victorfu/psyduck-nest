import MemberTable from "./member-table";
import { useLoaderData } from "react-router-dom";

function WorkspaceMemberPage() {
  const { members } = useLoaderData() as { members: WorkspaceAccess[] };

  return (
    <div>
      <MemberTable members={members} />
    </div>
  );
}

export default WorkspaceMemberPage;
