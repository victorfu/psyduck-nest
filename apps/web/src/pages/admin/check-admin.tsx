import { useAdminRootUser } from "@/hooks/use-root-user";

function CheckAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAdminRootUser();

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
      <>{children}</>
    </div>
  );
}

export default CheckAdmin;
