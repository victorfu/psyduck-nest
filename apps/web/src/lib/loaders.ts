import Api from "./api";

export async function loadUsers() {
  try {
    const users = await Api.getUsers();
    return { users };
  } catch (error) {
    return { users: [] };
  }
}

export async function loadWorkspaces() {
  try {
    const workspaces = await Api.getWorkspaces();
    return { workspaces };
  } catch (error) {
    return { workspaces: [] };
  }
}
