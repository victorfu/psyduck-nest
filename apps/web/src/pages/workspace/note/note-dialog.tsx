import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import Api from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useRevalidator } from "react-router-dom";

export default function NoteDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const revalidator = useRevalidator();

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const content = formData.get("content") as string;
    if (!content) {
      toast({
        title: "Please enter content",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    Api.createNote({ content })
      .then(() => {
        toast({
          title: "Note created",
          description: `Note has been created.`,
        });
      })
      .catch(() => {
        toast({
          title: "Failed to create note",
          description: `Note could not be created.`,
          variant: "destructive",
        });
      })
      .finally(() => {
        setOpen(false);
        setLoading(false);
        revalidator.revalidate();
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8" variant="outline">
          Add Note
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-[30vw] min-h-32">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
        </DialogHeader>

        <div className="flex items-start space-x-4">
          <div className="min-w-0 flex-1">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <label htmlFor="content">Content</label>
                  <Input name="content" id="content" />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
