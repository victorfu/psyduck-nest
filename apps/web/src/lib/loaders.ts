import Api from "./api";

type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
};

export async function adminLoadUsers() {
  try {
    const users = await Api.adminGetUsers();
    return { users };
  } catch (error) {
    console.error(error);
    return { users: [] };
  }
}

export async function adminLoadWorkspaces() {
  try {
    const workspaces = await Api.adminGetWorkspaces();
    return { workspaces };
  } catch (error) {
    console.error(error);
    return { workspaces: [] };
  }
}

export async function adminLoadWorkspace({ params }: { params: Params }) {
  const id = params.wid;
  if (!id) throw new Error("No workspace id");

  try {
    const workspace = await Api.adminGetWorkspace(+id);
    return { workspace };
  } catch (error) {
    console.error(error);
    return { workspace: {} };
  }
}

export async function loadWorkspaces() {
  try {
    const workspaces = await Api.getWorkspaces();
    return { workspaces };
  } catch (error) {
    console.error(error);
    return { workspaces: [] };
  }
}

export async function loadWorkspace({ params }: { params: Params }) {
  const id = params.wid;
  if (!id) throw new Error("No workspace id");

  try {
    const workspace = await Api.getWorkspace(+id);
    return { workspace };
  } catch (error) {
    console.error(error);
    return { workspace: {} };
  }
}

export async function adminLoadDashboard() {
  try {
    const users = await Api.adminGetUsers();
    const workspaces = await Api.adminGetWorkspaces();
    return { users, workspaces };
  } catch (error) {
    console.error(error);
    return { users: [], workspaces: [] };
  }
}

export async function adminLoadClients() {
  try {
    const clients = await Api.adminGetClients();
    return { clients };
  } catch (error) {
    console.error(error);
    return { clients: [] };
  }
}

export async function adminLoadOrganizations() {
  try {
    const organizations = await Api.adminGetOrganizations();
    return { organizations };
  } catch (error) {
    console.error(error);
    return { organizations: [] };
  }
}
