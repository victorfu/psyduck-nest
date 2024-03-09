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
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { MemberTableToolbar } from "./member-table-toolbar";

export default function MemberTable({
  members = [],
}: {
  members: WorkspaceAccess[];
}) {
  const { toast } = useToast();

  const columns: ColumnDef<WorkspaceAccess>[] = [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        const access = row.original;
        return (
          <div className="flex flex-row items-center space-x-1">
            <div
              className={
                !access.user.isActive
                  ? "text-muted-foreground"
                  : "font-semibold"
              }
            >
              {access.user.username ?? ""}
            </div>
            <div>
              {!access.user.isActive ? (
                <Badge variant="outline">Disabled</Badge>
              ) : (
                ""
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const access = row.original;
        return <div>{access.user.email ?? ""}</div>;
      },
    },
    {
      accessorKey: "role",
      header: "Role",
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
                onClick={() => {
                  navigator.clipboard
                    .writeText(String(access.user?.id ?? 0))
                    .catch(console.error);
                  toast({
                    title: "Email copied to clipboard",
                    description: access.user.email,
                  });
                }}
              >
                Copy Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={members.sort((a, b) => (a.id > b.id ? 1 : -1))}
        toolbarComponent={MemberTableToolbar}
      />
    </>
  );
}
