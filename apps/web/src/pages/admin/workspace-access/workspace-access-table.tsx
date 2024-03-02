import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { WorkspaceAccessTableToolbar } from "./workspace-access-table-toolbar";
import { useRevalidator } from "react-router-dom";
import Api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export function WorkspaceAccessTable({
  workspaceAccesses,
}: {
  workspaceAccesses: WorkspaceAccess[];
}) {
  const { toast } = useToast();
  const revalidator = useRevalidator();

  const columns: ColumnDef<WorkspaceAccess>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "user",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User" />
      ),
      cell: ({ row }) => {
        const access = row.original;
        return (
          <div>
            {access.user.username} (id: {access.user.id})
          </div>
        );
      },
    },
    {
      accessorKey: "workspace",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Workspace" />
      ),
      cell: ({ row }) => {
        const access = row.original;
        return (
          <div>
            {access.workspace.name} (id: {access.workspace.id})
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const access = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="text-red-600"
                onClick={async () => {
                  const text =
                    "Are you sure you want to delete this workspace?";
                  if (confirm(text) !== true) {
                    return;
                  }

                  try {
                    await Api.deleteWorkspaceAccess(access.id);
                    toast({
                      title: `Workspace access deleted.`,
                    });
                    revalidator.revalidate();
                  } catch (error) {
                    toast({
                      title: `Failed to delete workspace access.`,
                      variant: "destructive",
                    });
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={workspaceAccesses}
      toolbarComponent={WorkspaceAccessTableToolbar}
    />
  );
}
