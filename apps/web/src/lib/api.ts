import { authenticatedFetch } from "./authenticated-fetch";

export default class Api {
  // Root endpoints
  public static async login(username: string, password: string) {
    return fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  }

  public static async version(): Promise<{ version: string }> {
    return fetch("/api/version").then((res) => res.json());
  }

  public static async changePassword(
    currentPassword: string,
    newPassword: string,
  ) {
    return authenticatedFetch("/api/change-password", "POST", {
      currentPassword,
      newPassword,
    });
  }

  public static async setLocalPassword(newPassword: string) {
    return authenticatedFetch("/api/set-local-password", "POST", {
      newPassword,
    });
  }

  // Account endpoints
  public static async getAccount() {
    return authenticatedFetch<User>("/api/account");
  }

  public static async updateAccount(user: Partial<User>) {
    return authenticatedFetch<User>("/api/account", "PATCH", user);
  }

  public static async hasLocalAuth() {
    return authenticatedFetch<{ hasLocalAuth: boolean }>(
      "/api/account/has-local-auth",
      "POST",
    );
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
