import "./index.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { authLoader } from "./auth.ts";

import ErrorPage from "./pages/error-page.tsx";

import MainPage from "./pages/main-page.tsx";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <MainPage />,
    errorElement: <ErrorPage />,
    loader: authLoader,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
