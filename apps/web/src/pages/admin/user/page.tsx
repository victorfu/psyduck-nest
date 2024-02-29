import UserTable from "@/pages/admin/user/user-table";
import { useLoaderData } from "react-router-dom";
import AdminLayout from "../admin-layout";

function UserPage() {
  const { users } = useLoaderData() as { users: User[] };

  return (
    <AdminLayout>
      <UserTable users={users} />
    </AdminLayout>
  );
}

export default UserPage;
