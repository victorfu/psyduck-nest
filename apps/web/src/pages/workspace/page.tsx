import { useLoaderData } from "react-router-dom";

function UserWorkspacePage() {
  const { workspaces } = useLoaderData() as {
    workspaces: Workspace[];
  };

  return (
    <div>
      <h1>Workspaces</h1>
      <ul>
        {workspaces.map((workspace) => (
          <li key={workspace.id}>
            {workspace.id} {workspace.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserWorkspacePage;
