import { LoaderFunctionArgs, redirect } from "react-router-dom";
import localForage from "localforage";
import Api from "./lib/api";
import { z } from "zod";

interface AuthProvider {
  isAuthenticated: boolean;
  user: User | null;
  signin(
    username: string,
    password: string,
    rememberMe: boolean,
  ): Promise<void>;
  signinWithToken(): Promise<void>;
  signout(): Promise<void>;
}

interface TokenResponse {
  access_token: string;
}

export const authProvider: AuthProvider = {
  isAuthenticated: false,
  user: null,

  async signin(username: string, password: string, rememberMe: boolean) {
    try {
      const response = await Api.login(username, password, rememberMe);
      if (response.ok) {
        const responseJson = (await response.json()) as TokenResponse;
        const { access_token } = responseJson;
        await localForage.setItem("access_token", access_token);
        authProvider.isAuthenticated = true;

        const user = await Api.getAccount();
        authProvider.user = user;
        return;
      }
    } catch (error) {
      console.error(error);
    }

    authProvider.isAuthenticated = false;
    authProvider.user = null;
    throw new Error("Invalid login attempt");
  },

  async signinWithToken() {
    try {
      const user = await Api.getAccount();
      authProvider.isAuthenticated = true;
      authProvider.user = user;
      return;
    } catch (error) {
      console.error(error);
    }
    authProvider.isAuthenticated = false;
    authProvider.user = null;
    throw new Error("Invalid login attempt");
  },

  async signout() {
    authProvider.isAuthenticated = false;
    authProvider.user = null;
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
  const rememberMe = formData.get("remember-me") === "on";

  try {
    await authProvider.signin(username, password, rememberMe);
  } catch (error) {
    return {
      error:
        "The username or password provided is incorrect. Please try again.",
    };
  }

  const redirectTo = formData.get("redirectTo") as string | null;
  return redirect(redirectTo ?? "/");
}

export async function logoutAction() {
  await authProvider.signout();
  return redirect("/login");
}

export async function loginLoader({ request }: LoaderFunctionArgs) {
  try {
    await authProvider.signinWithToken();
  } catch (error) {
    // ignore
  }
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

export async function authLoader() {
  try {
    await authProvider.signinWithToken();
  } catch (error) {
    // ignore
  }
  if (!authProvider.isAuthenticated) return redirect("/login");
  return {
    user: authProvider.user,
  };
}

export async function forgotPasswordAction({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string | null;

  if (!email) {
    return {
      error: "You must provide an email to reset your password.",
    };
  }

  const emailSchema = z.string().email();
  const { success } = emailSchema.safeParse(email);
  if (!success) {
    return {
      error: "You must provide a valid email address.",
    };
  }

  try {
    const result = await Api.forgotPassword(email);
    if (result.ok) {
      return {
        message:
          "An email has been sent with instructions to reset your password.",
      };
    }
  } catch (error) {
    // ignore
  }

  return {
    error:
      "There was an error sending the password reset email. Please try again.",
  };
}
