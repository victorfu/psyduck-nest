import "./index.css";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import {
  forgotPasswordAction,
  loginAction,
  loginLoader,
  logoutAction,
  rootLoader,
} from "./auth.ts";
import DashboardPage from "./pages/admin/dashboard/page.tsx";
import UserPage from "./pages/admin/user/page.tsx";
import AccountPage from "./pages/account/page.tsx";
import LoginPage from "./pages/login-page.tsx";
import ErrorPage from "./pages/error-page.tsx";
import WorkspacePage from "./pages/admin/workspace/page.tsx";
import SettingsPage from "./pages/settings/page.tsx";
import Layout from "./layout.tsx";
import {
  loadClients,
  loadDashboard,
  loadUsers,
  loadWorkspaces,
} from "./lib/loaders.ts";
import AuthSuccessPage from "./pages/auth-success-page.tsx";
import ForgotPasswordPage from "./pages/forgot-password-page.tsx";
import { CookiesProvider } from "react-cookie";
import ClientPage from "./pages/admin/client/page.tsx";
import MyWorkspacePage from "./pages/my-workspace/page.tsx";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      { index: true, element: <Navigate to="/my-workspaces" replace /> },
      {
        path: "my-workspaces",
        element: <MyWorkspacePage />,
      },
      {
        path: "account",
        element: <AccountPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "dashboard",
        loader: loadDashboard,
        element: <DashboardPage />,
      },
      {
        path: "users",
        loader: loadUsers,
        element: <UserPage />,
      },
      {
        path: "workspaces",
        loader: loadWorkspaces,
        element: <WorkspacePage />,
      },
      {
        path: "clients",
        loader: loadClients,
        element: <ClientPage />,
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
    action: logoutAction,
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
    action: forgotPasswordAction,
    element: <ForgotPasswordPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
