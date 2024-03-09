import { useLoaderData, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { WorkspaceAccessTable } from "./workspace-access-table";

const SectionHeader = ({ workspace }: { workspace: Workspace }) => {
  const navigate = useNavigate();
  return (
    <div className="border-b border-gray-200 pb-5">
      <button className="text-sm text-gray-500" onClick={() => navigate(-1)}>
        {"< back"}
      </button>
      <div className="prose mt-2">
        <h2 className="font-semibold leading-6 text-gray-900">
          {workspace.name}
        </h2>
      </div>
      <div className="mt-2 max-w-4xl text-sm">{workspace.description}</div>
      <div className="max-w-4xl text-sm text-gray-500">
        created time: {format(workspace.createdAt, "yyyy/MM/dd HH:mm:ss")}
      </div>
    </div>
  );
};

function AdminWorkspaceAccessPage() {
  const { workspace } = useLoaderData() as { workspace: Workspace };

  return (
    <div>
      <SectionHeader workspace={workspace} />
      <br />
      <WorkspaceAccessTable workspaceAccesses={workspace.workspaceAccesses} />
    </div>
  );
}

export default AdminWorkspaceAccessPage;
