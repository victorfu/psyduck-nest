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

export default function UserDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // TODO: create user
    toast({
      title: "User created",
      description: `User ${name} (${password} ${email}) has been created.`,
    });

    setOpen(false);
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
                  <label htmlFor="name">Name</label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Name"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect="off"
                    autoSave="off"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
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
