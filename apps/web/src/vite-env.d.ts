/// <reference types="vite/client" />

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

interface User {
  id: number;
  username: string;
  isActive: boolean;
  roles: string[];
  email?: string;
  emailVerified?: boolean;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}
