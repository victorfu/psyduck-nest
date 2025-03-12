import "@ant-design/v5-patch-for-react-19";

import "./index.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, redirect } from "react-router-dom";
import { AuthProvider } from "./components/auth-provider.tsx";
import {
  loginLoader,
  mainLoader,
  workspacesLoader,
  rootLoader,
  settingsLoader,
  lineUsersLoader,
  membersLoader,
  dashboardLoader,
  scheduleMessagesLoader,
} from "./lib/loaders.ts";
import { loginAction } from "./lib/actions.ts";
import { authService } from "./auth/auth-service.ts";
import { Layout } from "./components/layout.tsx";

import ErrorPage from "./pages/error-page.tsx";
import MainPage from "./pages/main-page.tsx";
import LoginPage from "./pages/login-page.tsx";
import MembersPage from "./pages/members-page.tsx";
import SettingsPage from "./pages/settings-page.tsx";
import WorkspacesPage from "./pages/workspaces-page.tsx";
import DashboardPage from "./pages/dashboard-page.tsx";
import LineUsersPage from "./pages/line-users-page.tsx";
import ScheduleMessagesPage from "./pages/schedule-messages-page.tsx";
import { Fallback } from "./components/fallback.tsx";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader: rootLoader,
    HydrateFallback: Fallback,
    children: [
      {
        index: true,
        Component: MainPage,
        loader: mainLoader,
      },
      {
        id: "workspaces",
        path: "workspace/:workspaceId",
        Component: Layout,
        loader: workspacesLoader,
        children: [
          {
            index: true,
            Component: DashboardPage,
            loader: dashboardLoader,
          },
          {
            path: "members",
            Component: MembersPage,
            loader: membersLoader,
          },
          {
            path: "line-users",
            Component: LineUsersPage,
            loader: lineUsersLoader,
          },
          {
            path: "schedule-messages",
            Component: ScheduleMessagesPage,
            loader: scheduleMessagesLoader,
          },
          {
            path: "workspaces",
            Component: WorkspacesPage,
          },
          {
            path: "settings",
            Component: SettingsPage,
            loader: settingsLoader,
          },
        ],
      },
    ],
  },
  {
    path: "login",
    action: loginAction,
    loader: loginLoader,
    Component: LoginPage,
    HydrateFallback: Fallback,
  },
  {
    path: "/logout",
    async action() {
      await authService.signOut();
      return redirect("/");
    },
  },
  {
    path: "*",
    Component: ErrorPage,
    HydrateFallback: Fallback,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider router={router} />,
);
