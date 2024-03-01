import { useLoaderData } from "react-router-dom";
import { OrganizationTable } from "./organization-table";
import CheckAdmin from "../check-admin";

function OrganizationPage() {
  const { organizations } = useLoaderData() as {
    organizations: Organization[];
  };

  return (
    <CheckAdmin>
      <OrganizationTable organizations={organizations} />
    </CheckAdmin>
  );
}

export default OrganizationPage;
