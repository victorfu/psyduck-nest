import UserTable from "@/pages/admin/user/user-table";
import { useLoaderData } from "react-router-dom";
import CheckAdmin from "../check-admin";

function AdminUserPage() {
  const { users, workspaceAccesses } = useLoaderData() as {
    users: User[];
    workspaceAccesses: WorkspaceAccess[];
  };

  return (
    <CheckAdmin>
      <UserTable users={users} workspaceAccesses={workspaceAccesses} />
    </CheckAdmin>
  );
}

export default AdminUserPage;
