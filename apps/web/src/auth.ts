import { LoaderFunctionArgs, redirect } from "react-router-dom";
import localForage from "localforage";

interface AuthProvider {
  isAuthenticated: boolean;
  username: null | string;
  signin(username: string, password: string): Promise<void>;
  signinWithToken(): Promise<void>;
  signout(): Promise<void>;
}

interface TokenResponse {
  access_token: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const authProvider: AuthProvider = {
  isAuthenticated: false,
  username: null,

  async signin(username: string, password: string) {
    authProvider.username = username;
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (response.ok) {
      const responseJson = (await response.json()) as TokenResponse;
      const { access_token } = responseJson;
      await localForage.setItem("access_token", access_token);
      authProvider.isAuthenticated = true;
      return;
    }

    authProvider.isAuthenticated = false;
    throw new Error("Invalid login attempt");
  },

  async signinWithToken() {
    const access_token: string | null = await localForage.getItem(
      "access_token",
    );
    if (!access_token) {
      authProvider.isAuthenticated = false;
      authProvider.username = "";
      return;
    }
    const response = await fetch("/api/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const { username } = (await response.json()) as User;
      authProvider.isAuthenticated = true;
      authProvider.username = username;
      return;
    }
    authProvider.isAuthenticated = false;
    throw new Error("Invalid login attempt");
  },

  async signout() {
    authProvider.isAuthenticated = false;
    authProvider.username = "";
    await localForage.removeItem("access_token");
  },
};

export async function loginAction({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string | null;
  const password = formData.get("password") as string | null;
  if (!username) {
    return {
      error: "You must provide a username to log in",
    };
  }
  if (!password) {
    return {
      error: "You must provide a password to log in",
    };
  }

  try {
    await authProvider.signin(username, password);
  } catch (error) {
    return {
      error:
        "The username or password provided is incorrect. Please try again.",
    };
  }

  const redirectTo = formData.get("redirectTo") as string | null;
  return redirect(redirectTo ?? "/");
}

export function loginLoader({ request }: LoaderFunctionArgs) {
  const from = new URL(request.url).searchParams.get("from");
  if (authProvider.isAuthenticated) {
    return redirect(from ?? "/");
  }
  return null;
}

export function protectedLoader({ request }: LoaderFunctionArgs) {
  if (!authProvider.isAuthenticated) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}

export async function rootLoader() {
  try {
    await authProvider.signinWithToken();
  } catch (error) {
    // ignore
  }
  if (!authProvider.isAuthenticated) return redirect("/login");
  return {
    user: authProvider.username,
  };
}
