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
import { useToast } from "@/components/ui/use-toast";
import Api from "@/lib/api";
import { useRevalidator } from "react-router-dom";

export default function UserDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading] = useState(false);
  const revalidator = useRevalidator();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    Api.createUser({ username, password })
      .then(() => {
        toast({
          title: "User created",
          description: `User ${username} has been created.`,
        });
      })
      .catch(() => {
        toast({
          title: "Failed to create user",
          description: `User ${username} could not be created.`,
          variant: "destructive",
        });
      })
      .finally(() => {
        setOpen(false);
        revalidator.revalidate();
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8" variant="outline">
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-[30vw] min-h-32">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>

        <div className="flex items-start space-x-4">
          <div className="min-w-0 flex-1">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username">Username</label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Username"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    autoSave="off"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password">Password</label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="Password"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoSave="off"
                  />
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
