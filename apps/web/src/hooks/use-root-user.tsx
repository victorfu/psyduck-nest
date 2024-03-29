import { useRouteLoaderData } from "react-router-dom";

export function useRootUser() {
  return useRouteLoaderData("root") as { user: User };
}

export function useAdminRootUser() {
  return useRouteLoaderData("adminRoot") as { user: User };
}

export function useWorkspaceData() {
  return useRouteLoaderData("workspace") as {
    user: User;
    workspace: Workspace;
    workspaces: Workspace[];
  };
}
