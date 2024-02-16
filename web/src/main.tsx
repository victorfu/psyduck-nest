import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import PageOne from './pages/PageOne.tsx';
import PageTwo from './pages/PageTwo.tsx';
import { authProvider, loginAction, loginLoader, rootLoader } from './auth.ts';
import LoginPage from './pages/LoginPage.tsx';

const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    element: <App />,
    loader: rootLoader,
    children: [
      { index: true, element: <Navigate to="/page-one" replace /> },
      {
        path: 'page-one',
        element: <PageOne />,
      },
      {
        path: 'page-two',
        element: <PageTwo />,
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
    path: '/logout',
    action: async () => {
      await authProvider.signout();
      return redirect('/');
    },
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
);
