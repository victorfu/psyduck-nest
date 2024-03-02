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
import { useToast } from "@/components/ui/use-toast";
import DataTable from "@/components/ui/data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ClientTableToolbar } from "./client-table-toolbar";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Api from "@/lib/api";
import { useRevalidator } from "react-router-dom";

function ClientSheet({
  open,
  setOpen,
  selectedClient,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedClient?: Client;
}) {
  const { toast } = useToast();
  const revalidator = useRevalidator();

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const note = formData.get("note") as string;

    if (!selectedClient) return;

    Api.updateClient(selectedClient.id, { name, note })
      .then(() => {
        toast({
          title: "Client updated",
          description: `Client ${name} has been updated.`,
        });
      })
      .catch(() => {
        toast({
          title: "Failed to update client",
          description: `Client ${name} could not be updated.`,
          variant: "destructive",
        });
      })
      .finally(() => {
        setOpen(false);
        revalidator.revalidate();
      });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit client</SheetTitle>
          <SheetDescription>Make changes to your client here.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={selectedClient?.name}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Note
              </Label>
              <Input
                id="note"
                name="note"
                defaultValue={selectedClient?.note}
                className="col-span-3"
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit">Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function ClientTable({ clients }: { clients: Client[] }) {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<Client>();
  const [open, setOpen] = useState(false);
  const revalidator = useRevalidator();

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "note",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Note" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const client = row.original;
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
                  setSelectedClient(client);
                  setOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  const text = "Are you sure you want to delete this client?";
                  if (confirm(text) !== true) {
                    return;
                  }

                  Api.deleteClient(client.id)
                    .then(() => {
                      toast({
                        title: `${client.name} deleted.`,
                      });
                    })
                    .catch(() => {
                      toast({
                        title: `Failed to delete ${client.name}.`,
                        variant: "destructive",
                      });
                    })
                    .finally(() => {
                      revalidator.revalidate();
                    });
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
    <>
      <DataTable
        columns={columns}
        data={clients}
        toolbarComponent={ClientTableToolbar}
      />
      <ClientSheet
        selectedClient={selectedClient}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
