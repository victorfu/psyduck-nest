import Api from "./api";

type Params<Key extends string = string> = {
  readonly [key in Key]: string | undefined;
};

export async function loadUsers() {
  try {
    const users = await Api.getUsers();
    return { users };
  } catch (error) {
    console.error(error);
    return { users: [] };
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

export async function loadDashboard() {
  try {
    const users = await Api.getUsers();
    const workspaces = await Api.getWorkspaces();
    return { users, workspaces };
  } catch (error) {
    console.error(error);
    return { users: [], workspaces: [] };
  }
}

export async function loadClients() {
  try {
    const clients = await Api.getClients();
    return { clients };
  } catch (error) {
    console.error(error);
    return { clients: [] };
  }
}

export async function loadOrganizations() {
  try {
    const organizations = await Api.getOrganizations();
    return { organizations };
  } catch (error) {
    console.error(error);
    return { organizations: [] };
  }
}
