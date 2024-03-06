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
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { UserTableToolbar } from "./user-table-toolbar";
import Api from "@/lib/api";
import { Switch } from "@/components/ui/switch";
import { useRevalidator } from "react-router-dom";

export default function UserTable({ users = [] }: { users: User[] }) {
  const { toast } = useToast();
  const revalidator = useRevalidator();

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "Id",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div
            className={
              !user.isActive ? "text-muted-foreground" : "font-semibold"
            }
          >
            {user.id}
          </div>
        );
      },
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex flex-row items-center space-x-1">
            <div
              className={
                !user.isActive ? "text-muted-foreground" : "font-semibold"
              }
            >
              {user.username ?? ""}
            </div>
            <div>
              {!user.isActive ? <Badge variant="outline">Disabled</Badge> : ""}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "user",
      header: "Admin",
      cell: ({ row }) => {
        const user = row.original;
        const isAdmin = user.roles.includes("admin");
        return (
          <Switch
            checked={isAdmin}
            onCheckedChange={() => {
              Api.adminUpdateUser(user.id, {
                roles: isAdmin ? ["user"] : ["admin"],
              })
                .then(() => {
                  toast({
                    title: "Admin status updated",
                  });
                  revalidator.revalidate();
                })
                .catch(() => {
                  toast({
                    title: "Failed to update admin status",
                    description: `User ${user.username} admin status could not be updated.`,
                    variant: "destructive",
                  });
                });
            }}
          />
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const user = row.original;
        return <div>{user.email ?? ""}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CreatedAt" />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="w-24">
            {user.createdAt ? format(user.createdAt, "LLL dd, y") : ""}
          </div>
        );
      },
      sortingFn: (a, b) => {
        const userA = a.original;
        const userB = b.original;
        const aDate = userA.createdAt ? new Date(userA.createdAt) : new Date(0);
        const bDate = userB.createdAt ? new Date(userB.createdAt) : new Date(0);
        return aDate.getTime() - bDate.getTime();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
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
                    .writeText(String(user?.id ?? 0))
                    .catch(console.error);
                  toast({
                    title: "Id copied to clipboard",
                    description: user.id,
                  });
                }}
              >
                Copy Id
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await Api.adminResetPassword(user.id);
                    toast({
                      title: `${user.username} password is reset to the default password`,
                    });
                  } catch (error) {
                    toast({
                      title: "Failed to reset password",
                      description: user.username,
                      variant: "destructive",
                    });
                  }
                }}
              >
                Reset password
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await Api.adminUpdateUser(user.id, {
                      isActive: !user.isActive,
                    });
                    toast({
                      title: `${user.username} updated!`,
                    });
                    revalidator.revalidate();
                  } catch (error) {
                    toast({
                      title: `Failed to ${
                        !user.isActive ? "activate" : "disable"
                      } ${user.username}`,
                      variant: "destructive",
                    });
                  }
                }}
              >
                {!user.isActive ? "Activate" : "Disable"}
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
        data={users.sort((a, b) => (a.id > b.id ? 1 : -1))}
        toolbarComponent={UserTableToolbar}
      />
    </>
  );
}
