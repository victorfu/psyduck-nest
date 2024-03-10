import { authProvider } from "@/auth";
import Api from "./api";
import { redirect } from "react-router-dom";

type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
};

export async function workspacesLoader() {
  try {
    const workspaces = await Api.getWorkspaces();
    return { workspaces };
  } catch (error) {
    console.error(error);
    return { workspaces: [] };
  }
}

export async function workspaceLoader({ params }: { params: Params }) {
  const id = params.wid;
  if (!id) throw new Error("No workspace id");

  try {
    await authProvider.signinWithToken();
    if (!authProvider.isAuthenticated) return redirect("/login");
    const workspaces = await Api.getWorkspaces();
    const workspace = workspaces.find((w) => w.id === +id);
    return { workspace, user: authProvider.user, workspaces };
  } catch (error) {
    console.error(error);
    return { workspace: null, user: null, workspaces: [] };
  }
}

export async function workspaceMemberLoader({ params }: { params: Params }) {
  const id = params.wid;
  if (!id) throw new Error("No workspace id");

  try {
    const members = await Api.getWorkspaceMembers(+id);
    return { members };
  } catch (error) {
    console.error(error);
    return { members: [] };
  }
}

export async function adminUsersLoader() {
  try {
    const users = await Api.adminGetUsers();
    const workspaceAccesses = await Api.adminGetWorkspaceAccess();
    return { users, workspaceAccesses };
  } catch (error) {
    console.error(error);
    return { users: [], workspaceAccesses: [] };
  }
}

export async function adminWorkspacesLoader() {
  try {
    const workspaces = await Api.adminGetWorkspaces();
    return { workspaces };
  } catch (error) {
    console.error(error);
    return { workspaces: [] };
  }
}

export async function adminWorkspaceLoader({ params }: { params: Params }) {
  const id = params.wid;
  if (!id) throw new Error("No workspace id");

  try {
    const workspace = await Api.adminGetWorkspace(+id);
    return { workspace };
  } catch (error) {
    console.error(error);
    return { workspace: null };
  }
}

export async function adminDashboardLoader() {
  try {
    const users = await Api.adminGetUsers();
    const workspaces = await Api.adminGetWorkspaces();
    return { users, workspaces };
  } catch (error) {
    console.error(error);
    return { users: [], workspaces: [] };
  }
}

export async function adminClientsLoader() {
  try {
    const clients = await Api.adminGetClients();
    return { clients };
  } catch (error) {
    console.error(error);
    return { clients: [] };
  }
}

export async function adminOrganizationsLoader() {
  try {
    const organizations = await Api.adminGetOrganizations();
    return { organizations };
  } catch (error) {
    console.error(error);
    return { organizations: [] };
  }
}
