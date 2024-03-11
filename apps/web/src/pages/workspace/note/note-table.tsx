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
import { NoteTableToolbar } from "./note-table-toolbar";
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
import { Link, useLocation, useRevalidator } from "react-router-dom";
import { format } from "date-fns";

function NoteSheet({
  open,
  setOpen,
  selectedNote,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedNote?: Note;
}) {
  const { toast } = useToast();
  const revalidator = useRevalidator();

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;

    if (!selectedNote) return;

    Api.updateNote(selectedNote.id, { title })
      .then(() => {
        toast({
          title: "Note updated",
          description: `Note has been updated.`,
        });
      })
      .catch(() => {
        toast({
          title: "Failed to update note",
          description: `Note could not be updated.`,
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
          <SheetTitle>Edit note</SheetTitle>
          <SheetDescription>Make changes to your note here.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={selectedNote?.title}
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

export function NoteTable({ notes }: { notes: Note[] }) {
  const { toast } = useToast();
  const location = useLocation();
  const { pathname } = location;
  const [selectedNote, setSelectedNote] = useState<Note>();
  const [open, setOpen] = useState(false);
  const revalidator = useRevalidator();

  const columns: ColumnDef<Note>[] = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        const note = row.original;
        const wid = pathname.split("/")[2];

        return (
          <Link
            to={`/workspaces/${wid}/notes/${note.id}`}
            className="text-blue-600"
          >
            {note.title}
          </Link>
        );
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="UpdatedAt" />
      ),
      cell: ({ row }) => {
        const note = row.original;
        return (
          <div className="w-24">
            {note.updatedAt
              ? format(note.updatedAt, "yyyy-MM-dd HH:mm:dd")
              : ""}
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
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CreatedAt" />
      ),
      cell: ({ row }) => {
        const note = row.original;
        return (
          <div className="w-24">
            {note.createdAt
              ? format(note.createdAt, "yyyy-MM-dd HH:mm:dd")
              : ""}
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
        const note = row.original;
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
                  setSelectedNote(note);
                  setOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  const text = "Are you sure you want to delete this note?";
                  if (confirm(text) !== true) {
                    return;
                  }

                  Api.deleteNote(note.id)
                    .then(() => {
                      toast({
                        title: `${note.id} deleted.`,
                      });
                    })
                    .catch(() => {
                      toast({
                        title: `Failed to delete ${note.id}.`,
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
        data={notes}
        toolbarComponent={NoteTableToolbar}
      />
      <NoteSheet selectedNote={selectedNote} open={open} setOpen={setOpen} />
    </>
  );
}
