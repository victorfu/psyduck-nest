import { useRootUser } from "@/hooks/use-root-user";

function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useRootUser();

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

export default AdminLayout;
