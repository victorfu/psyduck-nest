import { authenticatedFetch } from "./authenticated-fetch";

export default class Api {
  // Auth endpoints
  public static async login(username: string, password: string) {
    return fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  }

  public static async me() {
    return authenticatedFetch<User>("/api/me");
  }

  // Users endpoints
  public static async getUsers() {
    return authenticatedFetch<User[]>("/api/users");
  }

  public static async createUser(user: { username: string; password: string }) {
    return authenticatedFetch<User>("/api/users", "POST", user);
  }

  public static async updateUser(id: number, user: Partial<User>) {
    return authenticatedFetch<User>(`/api/users/${id}`, "PATCH", user);
  }

  public static async resetPassword(id: number) {
    return authenticatedFetch(`/api/users/${id}/reset-password`, "POST");
  }
}
