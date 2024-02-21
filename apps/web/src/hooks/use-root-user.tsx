import { useRouteLoaderData } from "react-router-dom";

export function useRootUser() {
  return useRouteLoaderData("root") as { user: User | null };
}
