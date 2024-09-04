import "./index.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ErrorPage from "./pages/error-page.tsx";

import MainPage from "./pages/main-page.tsx";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    element: <MainPage />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
