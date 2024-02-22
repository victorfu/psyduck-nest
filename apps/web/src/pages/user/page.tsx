import UserTable from "@/pages/user/user-table";
import { useRootUser } from "@/hooks/use-root-user";
import { useLoaderData } from "react-router-dom";

function UserPage() {
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

export default UserPage;
