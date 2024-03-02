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
import { OrganizationTableToolbar } from "./organization-table-toolbar";
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

function OrganizationSheet({
  open,
  setOpen,
  selectedOrganization,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedOrganization?: Organization;
}) {
  const { toast } = useToast();
  const revalidator = useRevalidator();

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    if (!selectedOrganization) return;

    Api.updateOrganization(selectedOrganization.id, { name, description })
      .then(() => {
        toast({
          title: "Organization updated",
          description: `Organization ${name} has been updated.`,
        });
      })
      .catch(() => {
        toast({
          title: "Failed to update organization",
          description: `Organization ${name} could not be updated.`,
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
          <SheetTitle>Edit organization</SheetTitle>
          <SheetDescription>
            Make changes to your organization here.
          </SheetDescription>
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
                defaultValue={selectedOrganization?.name}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                defaultValue={selectedOrganization?.description}
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

export function OrganizationTable({
  organizations,
}: {
  organizations: Organization[];
}) {
  const { toast } = useToast();
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization>();
  const [open, setOpen] = useState(false);
  const revalidator = useRevalidator();

  const columns: ColumnDef<Organization>[] = [
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
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const organization = row.original;
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
                  setSelectedOrganization(organization);
                  setOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  const text =
                    "Are you sure you want to delete this organization?";
                  if (confirm(text) !== true) {
                    return;
                  }

                  Api.deleteOrganization(organization.id)
                    .then(() => {
                      toast({
                        title: `${organization.name} deleted.`,
                      });
                    })
                    .catch(() => {
                      toast({
                        title: `Failed to delete ${organization.name}.`,
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
        data={organizations}
        toolbarComponent={OrganizationTableToolbar}
      />
      <OrganizationSheet
        selectedOrganization={selectedOrganization}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
