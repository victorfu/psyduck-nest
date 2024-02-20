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
import { AdminSwitch } from "@/components/ui/admin-switch";
import { boolCompare, providerIdToName } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { UserTableToolbar } from "./user-table-toolbar";
import { useState } from "react";
// import UserWsMappingDialog from "./user-ws-mapping-dialog";

export default function UserTable({ users }: { users: User[] }) {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [open, setOpen] = useState(false);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex flex-col items-start">
            <div
              className={
                user.disabled ? "text-muted-foreground" : "font-semibold"
              }
            >
              {user.email ?? ""}
            </div>
            <div>
              {user.disabled ? <Badge variant="outline">Disabled</Badge> : ""}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "displayName",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex flex-col items-start">
            <div>{user.displayName ?? ""}</div>
            <div>{user.isOwner ? <Badge>Owner</Badge> : ""}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "user",
      header: "Admin",
      cell: ({ row }) => {
        const user = row.original;
        const isAdmin = user.customClaims?.isAdmin === true;
        return <AdminSwitch uid={user.uid} isAdmin={isAdmin} />;
      },
    },
    {
      accessorKey: "provider",
      header: "Provider",
      cell: ({ row }) => {
        const user = row.original;
        const providerId = user.providerData[0]?.providerId;
        return <div>{providerIdToName(providerId)}</div>;
      },
    },
    {
      accessorKey: "uid",
      header: "Uid",
    },
    {
      accessorKey: "lastSignInTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="LastSignInTime" />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="w-24">
            {user.metadata?.lastSignInTime
              ? format(user.metadata?.lastSignInTime, "LLL dd, y")
              : ""}
          </div>
        );
      },
      sortingFn: (a, b) => {
        const userA = a.original;
        const userB = b.original;
        const aDate = userA.metadata?.lastSignInTime
          ? new Date(userA.metadata.lastSignInTime)
          : new Date(0);
        const bDate = userB.metadata?.lastSignInTime
          ? new Date(userB.metadata.lastSignInTime)
          : new Date(0);
        return aDate.getTime() - bDate.getTime();
      },
    },
    {
      accessorKey: "creationTime",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CreationTime" />
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="w-24">
            {user.metadata?.creationTime
              ? format(user.metadata?.creationTime, "LLL dd, y")
              : ""}
          </div>
        );
      },
      sortingFn: (a, b) => {
        const userA = a.original;
        const userB = b.original;
        const aDate = userA.metadata?.creationTime
          ? new Date(userA.metadata.creationTime)
          : new Date(0);
        const bDate = userB.metadata?.creationTime
          ? new Date(userB.metadata.creationTime)
          : new Date(0);
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
                  void navigator.clipboard.writeText(user?.uid ?? "");
                  toast({
                    title: "Uid copied to clipboard",
                    description: user.uid,
                  });
                }}
              >
                Copy Uid
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user);
                  setOpen(true);
                }}
              >
                Assign
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  // TODO: update user status
                  toast({
                    title: `${user.email} ${
                      user.disabled ? "enabled" : "disabled"
                    }`,

                    description: `${user.displayName} ${user.uid}`,
                  });
                }}
              >
                {user.disabled ? "Enable" : "Disable"}
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
        data={users.sort((a, b) => {
          const disabledDiff = boolCompare(a.disabled, b.disabled);
          if (disabledDiff !== 0) return disabledDiff;

          const isOwnerDiff = boolCompare(
            b.isOwner ?? false,
            a.isOwner ?? false,
          );
          if (isOwnerDiff !== 0) return isOwnerDiff;

          const isAdminDiff = boolCompare(
            b.customClaims?.isAdmin,
            a.customClaims?.isAdmin,
          );
          if (isAdminDiff !== 0) return isAdminDiff;

          return a.email.localeCompare(b.email);
        })}
        toolbarComponent={UserTableToolbar}
      />
      {/* <UserWsMappingDialog
        selectedUser={selectedUser}
        open={open}
        setOpen={setOpen}
      /> */}
    </>
  );
}
