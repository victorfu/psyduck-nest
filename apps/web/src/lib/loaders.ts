import Api from "./api";

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
