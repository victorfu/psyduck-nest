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

  // Workspaces endpoints
  public static async getWorkspaces() {
    return authenticatedFetch<Workspace[]>("/api/workspaces");
  }

  public static async getWorkspace(id: number) {
    return authenticatedFetch<Workspace>(`/api/workspaces/${id}`);
  }

  public static async getWorkspaceMembers(id: number) {
    return authenticatedFetch<WorkspaceAccess[]>(
      `/api/workspaces/${id}/members`,
    );
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

  // Notes endpoints
  public static async getNotes() {
    return authenticatedFetch<Note[]>(`/api/notes`);
  }

  public static async getNote(id: number) {
    return authenticatedFetch<Note>(`/api/notes/${id}`);
  }

  public static async createNote(note: Partial<Note>) {
    return authenticatedFetch<Note>(`/api/notes`, "POST", note);
  }

  public static async updateNote(id: number, note: Partial<Note>) {
    return authenticatedFetch<Note>(`/api/notes/${id}`, "PATCH", note);
  }

  public static async deleteNote(id: number) {
    return authenticatedFetch(`/api/notes/${id}`, "DELETE");
  }

  // Admin Users endpoints
  public static async adminGetUsers(username?: string) {
    if (!username) return authenticatedFetch<User[]>("/api/admin/users");
    return authenticatedFetch<User[]>(`/api/admin/users?username=${username}`);
  }

  public static async adminCreateUser(user: {
    username: string;
    password: string;
  }) {
    return authenticatedFetch<User>("/api/admin/users", "POST", user);
  }

  public static async adminUpdateUser(id: number, user: Partial<User>) {
    return authenticatedFetch<User>(`/api/admin/users/${id}`, "PATCH", user);
  }

  public static async adminResetPassword(id: number) {
    return authenticatedFetch(`/api/admin/users/${id}/reset-password`, "POST");
  }

  // Admin Workspaces endpoints
  public static async adminGetWorkspaces() {
    return authenticatedFetch<Workspace[]>("/api/admin/workspaces");
  }

  public static async adminGetWorkspace(id: number) {
    return authenticatedFetch<Workspace>(`/api/admin/workspaces/${id}`);
  }

  public static async adminCreateWorkspace(workspace: Partial<Workspace>) {
    return authenticatedFetch<Workspace>(
      "/api/admin/workspaces",
      "POST",
      workspace,
    );
  }

  public static async adminUpdateWorkspace(
    id: number,
    workspace: Partial<Workspace>,
  ) {
    return authenticatedFetch<Workspace>(
      `/api/admin/workspaces/${id}`,
      "PATCH",
      workspace,
    );
  }

  public static async adminDeleteWorkspace(id: number) {
    return authenticatedFetch(`/api/admin/workspaces/${id}`, "DELETE");
  }

  // Admin Clients endpoints
  public static async adminGetClients() {
    return authenticatedFetch<Client[]>("/api/admin/clients");
  }

  public static async adminCreateClient(client: Partial<Client>) {
    return authenticatedFetch<Client>("/api/admin/clients", "POST", client);
  }

  public static async adminUpdateClient(id: number, client: Partial<Client>) {
    return authenticatedFetch<Client>(
      `/api/admin/clients/${id}`,
      "PATCH",
      client,
    );
  }

  public static async adminDeleteClient(id: number) {
    return authenticatedFetch(`/api/admin/clients/${id}`, "DELETE");
  }

  // Admin Organizations endpoints
  public static async adminGetOrganizations() {
    return authenticatedFetch<Organization[]>("/api/admin/organizations");
  }

  public static async adminCreateOrganization(
    organization: Partial<Organization>,
  ) {
    return authenticatedFetch<Organization>(
      "/api/admin/organizations",
      "POST",
      organization,
    );
  }

  public static async adminUpdateOrganization(
    id: number,
    organization: Partial<Organization>,
  ) {
    return authenticatedFetch<Organization>(
      `/api/admin/organizations/${id}`,
      "PATCH",
      organization,
    );
  }

  public static async adminDeleteOrganization(id: number) {
    return authenticatedFetch(`/api/admin/organizations/${id}`, "DELETE");
  }

  // Admin Workspace access endpoints
  public static async adminGetWorkspaceAccess() {
    return authenticatedFetch<WorkspaceAccess[]>(`/api/admin/workspace-access`);
  }

  public static async adminCreateWorkspaceAccess(
    workspaceAccess: Partial<WorkspaceAccess>,
  ) {
    return authenticatedFetch<WorkspaceAccess>(
      `/api/admin/workspace-access`,
      "POST",
      workspaceAccess,
    );
  }

  public static async adminUpdateWorkspaceAccess(
    id: number,
    workspaceAccess: Partial<WorkspaceAccess>,
  ) {
    return authenticatedFetch<WorkspaceAccess>(
      `/api/admin/workspace-access/${id}`,
      "PATCH",
      workspaceAccess,
    );
  }

  public static async adminDeleteWorkspaceAccess(id: number) {
    return authenticatedFetch(`/api/admin/workspace-access/${id}`, "DELETE");
  }
}
