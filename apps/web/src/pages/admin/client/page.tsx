import { useLoaderData } from "react-router-dom";
import { ClientTable } from "./client-table";
import CheckAdmin from "../check-admin";

function AdminClientPage() {
  const { clients } = useLoaderData() as { clients: Client[] };

  return (
    <CheckAdmin>
      <ClientTable clients={clients} />
    </CheckAdmin>
  );
}

export default AdminClientPage;
