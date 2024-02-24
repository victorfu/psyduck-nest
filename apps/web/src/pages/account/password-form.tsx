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
import { useEffect, useState } from "react";
import { useRevalidator } from "react-router-dom";

const passwordFormSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(4),
});

function useLocalAuth() {
  const [hasLocalAuth, setHasLocalAuth] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    Api.hasLocalAuth()
      .then((data) => setHasLocalAuth(data.hasLocalAuth))
      .catch(console.error);
  }, []);

  return { hasLocalAuth };
}

function PasswordForm() {
  const { user } = useRootUser();
  const { hasLocalAuth } = useLocalAuth();
  const hasGoogleAuth = !!user?.oauthGoogleRaw;
  const { toast } = useToast();
  const revalidator = useRevalidator();

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    if (!user) return;

    if (hasLocalAuth) {
      if (!values.currentPassword) {
        passwordForm.setError("currentPassword", {
          type: "manual",
          message: "Current password is required",
        });
        return;
      }

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
      } finally {
        revalidator.revalidate();
      }

      return;
    }

    if (!hasGoogleAuth) return;

    try {
      await Api.setLocalPassword(values.newPassword);
      toast({
        title: "Password set",
        description: "You have successfully set your password.",
      });

      passwordForm.reset();

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast({
        title: "Password set failed",
        description: "There was an error setting your password.",
        variant: "destructive",
      });
    } finally {
      revalidator.revalidate();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          {hasLocalAuth ? (
            <>
              Change your password here. After saving, you will be logged out.
            </>
          ) : (
            <>
              You are using Google to sign in. You can set a password to support
              username and password sign in.
            </>
          )}
        </CardDescription>
      </CardHeader>
      <Form {...passwordForm}>
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="space-y-2"
        >
          <CardContent className="space-y-2">
            {hasLocalAuth && (
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
            )}
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
