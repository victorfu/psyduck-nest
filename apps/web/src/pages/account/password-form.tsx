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

const passwordFormSchema = z.object({
  currentPassword: z.string().min(4),
  newPassword: z.string().min(4),
});

function PasswordForm() {
  const { user } = useRootUser();
  const { toast } = useToast();

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    if (!user) return;
    try {
      await Api.changePassword(values.currentPassword, values.newPassword);
      toast({
        title: "Password changed",
        description: "You have successfully changed your password.",
      });

      passwordForm.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Password change failed",
        description: "There was an error changing your password.",
        variant: "destructive",
      });
    }
  }

  const oauthGoogleRaw = user?.oauthGoogleRaw;

  // password 1, oauthGoogleRaw 1 -> both local and google auth
  // password 1, oauthGoogleRaw 0 -> only local auth
  // password 0, oauthGoogleRaw 1 -> only google auth

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password here. After saving, you will be logged out.
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
              name="currentPassword"
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
              name="newPassword"
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
            <Button>Save password</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default PasswordForm;
