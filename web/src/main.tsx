import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import { authProvider, loginAction, loginLoader, rootLoader } from './auth.ts';
import DashboardPage from './pages/DashboardPage.tsx';
import UsersPage from './pages/UsersPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import ProjectsPage from './pages/ProjectsPage.tsx';
import CalendarPage from './pages/CalendarPage.tsx';
import ReportsPage from './pages/ReportsPage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';

const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'projects',
        element: <ProjectsPage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: 'login',
    action: loginAction,
    loader: loginLoader,
    element: <LoginPage />,
  },
  {
    path: 'logout',
    action: async () => {
      await authProvider.signout();
      return redirect('/');
    },
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);
