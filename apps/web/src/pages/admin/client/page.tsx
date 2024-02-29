import { useLoaderData } from "react-router-dom";
import { ClientTable } from "./client-table";
import AdminLayout from "../admin-layout";

function ClientPage() {
  const { clients } = useLoaderData() as { clients: Client[] };

  return (
    <AdminLayout>
      <ClientTable clients={clients} />
    </AdminLayout>
  );
}

export default ClientPage;
