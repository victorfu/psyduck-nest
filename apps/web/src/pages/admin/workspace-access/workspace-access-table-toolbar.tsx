import { Table } from "@tanstack/react-table";
import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import WorkspaceAccessDialog from "./workspace-access-dialog";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function WorkspaceAccessTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <WorkspaceAccessDialog />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
