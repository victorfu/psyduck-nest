import Api from "./api";

export async function loadUsers() {
  try {
    const users = await Api.getUsers();
    return { users };
  } catch (error) {
    return { users: [] };
  }
}
