/// <reference types="vite/client" />

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

interface User {
  id: number;
  username: string;
  isActive: boolean;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;

  // Optional fields
  email?: string;
  emailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  picture?: string;
  birthday?: string;
  oauthGoogleRaw?: string;
}

interface Workspace {
  id: number;
  name?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
