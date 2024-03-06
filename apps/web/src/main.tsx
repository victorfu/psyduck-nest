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
  adminLoadClients,
  adminLoadDashboard,
  adminLoadOrganizations,
  adminLoadUsers,
  loadWorkspaces,
  adminLoadWorkspace,
  adminLoadWorkspaces,
} from "./lib/loaders.ts";
import AuthSuccessPage from "./pages/auth-success-page.tsx";
import ForgotPasswordPage from "./pages/forgot-password-page.tsx";
import { CookiesProvider } from "react-cookie";
import ClientPage from "./pages/admin/client/page.tsx";
import UserWorkspacePage from "./pages/workspace/page.tsx";
import OrganizationPage from "./pages/admin/organization/page.tsx";
import AdminLayout from "./admin-layout.tsx";
import WorkspaceAccessPage from "./pages/admin/workspace-access/page.tsx";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      { index: true, element: <Navigate to="/workspaces" replace /> },
      {
        path: "workspaces",
        loader: loadWorkspaces,
        element: <UserWorkspacePage />,
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
    id: "adminRoot",
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      {
        path: "dashboard",
        loader: adminLoadDashboard,
        element: <DashboardPage />,
      },
      {
        path: "users",
        loader: adminLoadUsers,
        element: <UserPage />,
      },
      {
        path: "organizations",
        loader: adminLoadOrganizations,
        element: <OrganizationPage />,
      },
      {
        path: "workspaces",
        loader: adminLoadWorkspaces,
        element: <WorkspacePage />,
      },
      {
        path: "workspaces/:wid",
        loader: adminLoadWorkspace,
        element: <WorkspaceAccessPage />,
      },
      {
        path: "clients",
        loader: adminLoadClients,
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
