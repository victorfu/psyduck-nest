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
  authLoader,
} from "./auth.ts";
import AdminDashboardPage from "./pages/admin/dashboard/page.tsx";
import AdminUserPage from "./pages/admin/user/page.tsx";
import AccountPage from "./pages/account/page.tsx";
import LoginPage from "./pages/login-page.tsx";
import ErrorPage from "./pages/error-page.tsx";
import AdminWorkspacePage from "./pages/admin/workspace/page.tsx";
import SettingsPage from "./pages/settings/page.tsx";
import Layout from "./components/layout.tsx";
import {
  adminClientsLoader,
  adminDashboardLoader,
  adminOrganizationsLoader,
  adminUsersLoader,
  workspacesLoader,
  adminWorkspaceLoader,
  adminWorkspacesLoader,
  workspaceLoader,
} from "./lib/loaders.ts";
import AuthSuccessPage from "./pages/auth-success-page.tsx";
import ForgotPasswordPage from "./pages/forgot-password-page.tsx";
import { CookiesProvider } from "react-cookie";
import AdminClientPage from "./pages/admin/client/page.tsx";
import AdminOrganizationPage from "./pages/admin/organization/page.tsx";
import AdminLayout from "./components/admin-layout.tsx";
import AdminWorkspaceAccessPage from "./pages/admin/workspace-access/page.tsx";
import WorkspaceListPage from "./pages/list/page.tsx";
import WorkspaceLayout from "./components/workspace-layout.tsx";
import WorkspaceClientPage from "./pages/workspace/client/page.tsx";
import WorkspaceMemberPage from "./pages/workspace/member/page.tsx";
import WorkspaceSettingsPage from "./pages/workspace/settings/page.tsx";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    loader: authLoader,
    children: [
      { index: true, element: <Navigate to="workspaces" replace /> },
      {
        path: "workspaces",
        loader: workspacesLoader,
        element: <WorkspaceListPage />,
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
    id: "workspace",
    path: "/workspaces/:wid",
    element: <WorkspaceLayout />,
    errorElement: <ErrorPage />,
    loader: workspaceLoader,
    children: [
      {
        index: true,
        element: <Navigate to="clients" replace />,
      },
      {
        path: "clients",
        element: <WorkspaceClientPage />,
      },
      {
        path: "members",
        element: <WorkspaceMemberPage />,
      },
      {
        path: "settings",
        element: <WorkspaceSettingsPage />,
      },
    ],
  },
  {
    id: "adminRoot",
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    loader: authLoader,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      {
        path: "dashboard",
        loader: adminDashboardLoader,
        element: <AdminDashboardPage />,
      },
      {
        path: "users",
        loader: adminUsersLoader,
        element: <AdminUserPage />,
      },
      {
        path: "organizations",
        loader: adminOrganizationsLoader,
        element: <AdminOrganizationPage />,
      },
      {
        path: "workspaces",
        loader: adminWorkspacesLoader,
        element: <AdminWorkspacePage />,
      },
      {
        path: "workspaces/:wid",
        loader: adminWorkspaceLoader,
        element: <AdminWorkspaceAccessPage />,
      },
      {
        path: "clients",
        loader: adminClientsLoader,
        element: <AdminClientPage />,
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
