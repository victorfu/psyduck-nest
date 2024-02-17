import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { authProvider, loginAction, loginLoader, rootLoader } from "./auth.ts";
import DashboardPage from "./pages/dashboard-page.tsx";
import UsersPage from "./pages/users-page.tsx";
import LoginPage from "./pages/login-page.tsx";
import ErrorPage from "./pages/error-page.tsx";
import ProjectsPage from "./pages/projects-page.tsx";
import CalendarPage from "./pages/calendar-page.tsx";
import ReportsPage from "./pages/reports-page.tsx";
import SettingsPage from "./pages/settings-page.tsx";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <App />,
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
        element: <UsersPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "calendar",
        element: <CalendarPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
