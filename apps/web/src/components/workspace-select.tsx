import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { memo, useCallback, useMemo } from "react";
import { Workspace } from "@/lib/workspace";

interface WorkspaceSelectProps {
  workspaces: Workspace[];
}

export const WorkspaceSelect = memo(function WorkspaceSelect({
  workspaces,
}: WorkspaceSelectProps) {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const handleChange = useCallback(
    (value: string) => {
      const currentUrl = window.location.pathname;
      const newUrl = currentUrl.replace(
        `/workspace/${workspaceId}`,
        `/workspace/${value}`,
      );

      navigate(newUrl);
    },
    [workspaceId, navigate],
  );

  const options = useMemo(
    () =>
      workspaces.map((workspace) => ({
        value: workspace.id,
        label: workspace.name,
      })),
    [workspaces],
  );

  const selectedWorkspaceId = useMemo(() => {
    const found = workspaces.find((workspace) => workspace.id === workspaceId);
    return found?.id;
  }, [workspaces, workspaceId]);

  return (
    <Select
      value={selectedWorkspaceId}
      style={{ width: 160 }}
      onChange={handleChange}
      options={options}
    />
  );
});
