import { useLoaderData } from "react-router-dom";
import { ClientTable } from "./client-table";

function ClientPage() {
  const { clients } = useLoaderData() as { clients: Client[] };

  return (
    <div>
      <ClientTable clients={clients} />
    </div>
  );
}

export default ClientPage;
