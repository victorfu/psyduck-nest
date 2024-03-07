import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLoaderData, useRevalidator } from "react-router-dom";
import Api from "@/lib/api";
import debounce from "lodash/debounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function WorkspaceAccessDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const revalidator = useRevalidator();
  const [value, setValue] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);
  const { workspace } = useLoaderData() as { workspace: Workspace };

  useEffect(() => {
    setValue("");
    setUsers([]);
    setSelectedUser(undefined);
  }, [open]);

  const fetchUsers = (searchValue: string) => {
    Api.adminGetUsers(searchValue)
      .then((users) => {
        setUsers(users);
      })
      .catch(console.error);
  };

  const debouncedFetchUsers = useCallback(debounce(fetchUsers, 500), []);

  function handleOnChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);

    if (event.target.value.length === 0) {
      setUsers([]);
      return;
    }
    debouncedFetchUsers(event.target.value);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!selectedUser) {
      toast({
        title: "Please select a user",
      });
      return;
    }

    try {
      setLoading(true);
      await Api.adminCreateWorkspaceAccess({
        user: {
          id: selectedUser.id,
        },
        workspace: {
          id: workspace.id,
        },
        role: "read",
      });
      revalidator.revalidate();
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const MemberList = ({ users }: { users: User[] }) => {
    const { workspaceAccesses } = workspace;

    return (
      <ul role="list" className="divide-y divide-gray-100">
        {users
          .filter((u) => {
            return !workspaceAccesses.some((wa) => wa.user.id === u.id);
          })
          .map((user) => (
            <li
              key={user.username}
              className={`flex items-center justify-between gap-x-6 px-2 py-3 cursor-pointer ${selectedUser?.username === user.username ? "bg-gray-200" : ""}`}
              onClick={() => {
                if (selectedUser?.username === user.username) {
                  setSelectedUser(undefined);
                } else {
                  setSelectedUser(user);
                }
              }}
            >
              <div className="flex min-w-0 gap-x-4">
                <Avatar>
                  <AvatarImage src={user?.picture} alt="avatar" />
                  <AvatarFallback>
                    {user?.username?.at(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-auto flex items-center">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {user.username}
                  </p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen <time>:D</time>
                </p>
              </div>
            </li>
          ))}
      </ul>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8" variant="outline">
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-[30vw] min-h-32">
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>

        <div className="flex items-start space-x-4">
          <div className="min-w-0 flex-1">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username">add member by username</label>
                  <Input
                    name="username"
                    id="username"
                    value={value}
                    onChange={handleOnChange}
                  />
                </div>
                <MemberList users={users} />
                <Button type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
