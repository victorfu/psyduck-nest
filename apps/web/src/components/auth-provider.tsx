import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "../auth/auth-state"; // Just import to ensure it's initialized

export function AuthProvider({
  router,
}: {
  router: ReturnType<typeof createBrowserRouter>;
}) {
  return <RouterProvider router={router} />;
}
