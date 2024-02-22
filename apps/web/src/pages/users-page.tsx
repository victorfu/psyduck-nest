import UserTable from "@/components/user-table";
import { useRootUser } from "@/hooks/use-root-user";
import { useLoaderData } from "react-router-dom";

function UsersPage() {
  const { user } = useRootUser();
  const { users } = useLoaderData() as { users: User[] };

  if (!user) return null;
  if (!user.roles.includes("admin")) {
    return (
      <div>
        <h1>Access Denied</h1>
      </div>
    );
  }

  return (
    <div>
      <UserTable users={users} />
    </div>
  );
}

export default UsersPage;
