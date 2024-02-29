import { authenticatedFetch } from "./authenticated-fetch";

export default class Api {
  // Root endpoints
  public static async login(
    username: string,
    password: string,
    rememberMe: boolean,
  ) {
    return fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, rememberMe }),
    });
  }

  public static async forgotPassword(email: string) {
    return fetch("/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  }

  public static async version(): Promise<{ version: string }> {
    return fetch("/api/version").then((res) => res.json());
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

  public static async changePassword(
    currentPassword: string,
    newPassword: string,
  ) {
    return authenticatedFetch("/api/account/change-password", "POST", {
      currentPassword,
      newPassword,
    });
  }

  public static async setLocalPassword(newPassword: string) {
    return authenticatedFetch("/api/account/set-local-password", "POST", {
      newPassword,
    });
  }

  public static async sendVerificationEmail() {
    return authenticatedFetch("/api/account/send-verification-email", "POST");
  }

  public static async uploadPicture(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return authenticatedFetch("/api/account/picture", "POST", formData, false);
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

  // Workspaces endpoints
  public static async getWorkspaces() {
    return authenticatedFetch<Workspace[]>("/api/workspaces");
  }

  public static async createWorkspace(workspace: Partial<Workspace>) {
    return authenticatedFetch<Workspace>("/api/workspaces", "POST", workspace);
  }

  public static async updateWorkspace(
    id: number,
    workspace: Partial<Workspace>,
  ) {
    return authenticatedFetch<Workspace>(
      `/api/workspaces/${id}`,
      "PATCH",
      workspace,
    );
  }

  public static async deleteWorkspace(id: number) {
    return authenticatedFetch(`/api/workspaces/${id}`, "DELETE");
  }

  // Clients endpoints
  public static async getClients() {
    return authenticatedFetch<Client[]>("/api/clients");
  }

  public static async createClient(client: Partial<Client>) {
    return authenticatedFetch<Client>("/api/clients", "POST", client);
  }

  public static async updateClient(id: number, client: Partial<Client>) {
    return authenticatedFetch<Client>(`/api/clients/${id}`, "PATCH", client);
  }

  public static async deleteClient(id: number) {
    return authenticatedFetch(`/api/clients/${id}`, "DELETE");
  }
}
