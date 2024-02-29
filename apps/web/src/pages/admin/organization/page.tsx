import { useLoaderData } from "react-router-dom";
import { OrganizationTable } from "./organization-table";
import AdminLayout from "../admin-layout";

function OrganizationPage() {
  const { organizations } = useLoaderData() as {
    organizations: Organization[];
  };

  return (
    <AdminLayout>
      <OrganizationTable organizations={organizations} />
    </AdminLayout>
  );
}

export default OrganizationPage;
