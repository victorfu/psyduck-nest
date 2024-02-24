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
import { useToast } from "@/components/ui/use-toast";
import { MailCheckIcon, MailQuestionIcon } from "lucide-react";
import { useRevalidator } from "react-router-dom";

const accountFormSchema = z.object({
  username: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

function AccountForm() {
  const { user } = useRootUser();
  const { toast } = useToast();
  const revalidator = useRevalidator();

  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: user?.username,
      email: user?.email ?? "",
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    },
  });

  async function onAccountSubmit(values: z.infer<typeof accountFormSchema>) {
    if (!user) return;
    const noUsernameValues = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
    };
    try {
      await Api.updateAccount(noUsernameValues);
      toast({
        title: "Account updated",
        description: "You have successfully updated your account.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Account update failed",
        description: "There was an error updating your account.",
        variant: "destructive",
      });
    } finally {
      revalidator.revalidate();
    }
  }

  const oauthGoogleRaw = user?.oauthGoogleRaw;

  const EmailVerification = () => {
    if (!user?.email) return null;
    return (
      <>
        {!user?.emailVerified ? (
          <MailQuestionIcon className="w-4 h-4 ml-1 text-red-500" />
        ) : (
          <MailCheckIcon className="w-4 h-4 ml-1 text-green-500" />
        )}
      </>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Make changes to your account here.</CardDescription>
      </CardHeader>
      <Form {...accountForm}>
        <form
          onSubmit={accountForm.handleSubmit(onAccountSubmit)}
          className="space-y-2"
        >
          <CardContent className="space-y-2">
            <FormField
              control={accountForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={accountForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex">
                    Email
                    <EmailVerification />
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!!oauthGoogleRaw} />
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
            <Button>Save changes</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default AccountForm;
