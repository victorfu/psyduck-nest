import UserTable from "@/components/user-table";
import { useLoaderData } from "react-router-dom";

function UsersPage() {
  const { users } = useLoaderData() as { users: User[] };
  return (
    <div>
      <UserTable users={users} />
    </div>
  );
}

export default UsersPage;
