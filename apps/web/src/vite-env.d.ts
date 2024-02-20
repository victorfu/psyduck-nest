/// <reference types="vite/client" />

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

interface ProviderData {
  photoURL?: string;
  providerId: string;
  uid: string;
  displayName?: string;
  email?: string;
}

interface Metadata {
  lastSignInTime: string;
  creationTime: string;
  lastRefreshTime: string;
}

interface CustomClaims {
  isAdmin: boolean;
}

interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  photoURL: string;
  disabled: boolean;
  metadata: Metadata;
  customClaims: CustomClaims;
  tokensValidAfterTime: string;
  providerData: ProviderData[];
  isOwner?: boolean; // owner is defined in config.ts, not in firebase
}
