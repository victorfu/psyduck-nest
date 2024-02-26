import "./index.css";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { authProvider, loginAction, loginLoader, rootLoader } from "./auth.ts";
import DashboardPage from "./pages/dashboard/page.tsx";
import UserPage from "./pages/user/page.tsx";
import AccountPage from "./pages/account/page.tsx";
import LoginPage from "./pages/login-page.tsx";
import ErrorPage from "./pages/error-page.tsx";
import WorkspacePage from "./pages/workspace/page.tsx";
import SettingsPage from "./pages/settings/page.tsx";
import Layout from "./layout.tsx";
import { loadUsers } from "./lib/loaders.ts";
import AuthSuccessPage from "./pages/auth-success-page.tsx";
import ForgotPasswordPage from "./pages/forgot-password-page.tsx";
import { CookiesProvider } from "react-cookie";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "users",
        loader: loadUsers,
        element: <UserPage />,
      },
      {
        path: "workspaces",
        element: <WorkspacePage />,
      },
      {
        path: "account",
        element: <AccountPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "login",
    action: loginAction,
    loader: loginLoader,
    element: <LoginPage />,
  },
  {
    path: "logout",
    action: async () => {
      await authProvider.signout();
      return redirect("/");
    },
  },
  {
    path: "auth/google/success",
    element: (
      <CookiesProvider>
        <AuthSuccessPage />
      </CookiesProvider>
    ),
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
