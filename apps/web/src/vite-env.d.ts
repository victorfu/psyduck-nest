/// <reference types="vite/client" />

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

interface User {
  id: number;
  username: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;

  // Optional fields
  email?: string;
  emailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  picture?: string;
  birthday?: string;
  oauthGoogleRaw?: string;
  language?: string;
}

interface Workspace {
  id: number;
  name: string;
  description: string;
  manager: string;
  createdAt: string;
  updatedAt: string;
  workspaceAccesses: WorkspaceAccess[];
}

interface WorkspaceAccess {
  id: number;
  user: Partial<User>;
  workspace: Partial<Workspace>;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Client {
  id: number;
  name?: string;
  birthday?: string;
  email?: string;
  note?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

interface Organization {
  id: number;
  name?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
