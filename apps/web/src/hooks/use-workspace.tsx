import { useCallback, useEffect, useState } from "react";
import { getWorkspace, Workspace } from "@/lib/workspace";

export const useWorkspace = ({ workspaceId }: { workspaceId?: string }) => {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);

  const fetchWorkspace = useCallback(async () => {
    if (!workspaceId) {
      return;
    }

    try {
      const workspace = await getWorkspace(workspaceId);
      setWorkspace(workspace);
    } catch (err) {
      console.error("Failed to fetch workspace:", err);
    }
  }, [workspaceId]);

  useEffect(() => {
    void fetchWorkspace();
  }, [fetchWorkspace]);

  return { workspace, fetchWorkspace };
};
