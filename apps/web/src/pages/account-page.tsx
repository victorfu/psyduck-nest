import { Button } from "@/components/ui/button";
import { useRootUser } from "@/hooks/use-root-user";
import Api from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const accountFormSchema = z.object({
  username: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const passwordFormSchema = z.object({
  current: z.string().min(8),
  new: z.string().min(8),
});

function AccountPage() {
  const { user } = useRootUser();

  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: user?.username,
      email: user?.email ?? undefined,
      firstName: user?.firstName ?? undefined,
      lastName: user?.lastName ?? undefined,
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current: "",
      new: "",
    },
  });

  function onAccountSubmit(values: z.infer<typeof accountFormSchema>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { username, ...rest } = values;
    if (!user) return;
    Api.updateUser(user.id, rest).catch(console.error);
  }

  function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    if (!user) return;
    console.log(values);
    // TODO: Implement password change
  }

  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here.
            </CardDescription>
          </CardHeader>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-2"
            >
              <CardContent className="space-y-2">
                <FormField
                  control={passwordForm.control}
                  name="current"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="new"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you will be logged out.
            </CardDescription>
          </CardHeader>
          <Form {...accountForm}>
            <form
              onSubmit={accountForm.handleSubmit(onAccountSubmit)}
              className="space-y-2"
            >
              <CardContent className="space-y-2">
                <FormField
                  control={accountForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={accountForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default AccountPage;
