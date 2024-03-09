import UserTable from "@/pages/admin/user/user-table";
import { useLoaderData } from "react-router-dom";
import CheckAdmin from "../check-admin";

function AdminUserPage() {
  const { users } = useLoaderData() as { users: User[] };

  return (
    <CheckAdmin>
      <UserTable users={users} />
    </CheckAdmin>
  );
}

export default AdminUserPage;
