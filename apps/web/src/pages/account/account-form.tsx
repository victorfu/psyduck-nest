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
import { CalendarIcon, MailCheckIcon, MailQuestionIcon } from "lucide-react";
import { useRevalidator } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import AccountPicture from "./account-picture";

const accountFormSchema = z.object({
  username: z.string(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  birthday: z.date().optional(),
  picture: z
    // .union([z.instanceof(File), z.string()])
    .any()
    .refine((data) => {
      if (typeof data === "string") return data.startsWith("http");
      if (data instanceof File) return data.type.startsWith("image/");
      return false;
    })
    .optional(),
});

function AccountForm() {
  const { user } = useRootUser();
  const { toast } = useToast();
  const revalidator = useRevalidator();

  const accountForm = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: user?.username,
      email: user?.email ?? undefined,
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      birthday: user?.birthday ? new Date(user.birthday) : undefined,
      picture: user?.picture ?? undefined,
    },
  });

  async function onAccountSubmit(values: z.infer<typeof accountFormSchema>) {
    if (!user) return;

    const noUsernameValues = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      birthday: values.birthday?.toISOString().split("T")[0] ?? undefined,
    };

    try {
      await Api.updateAccount(noUsernameValues);
      if (values.picture && values.picture instanceof File) {
        await Api.uploadPicture(values.picture);
      }
      toast({
        title: "Account updated",
        description: "You have successfully updated your account.",
      });
      revalidator.revalidate();
    } catch (error) {
      console.error(error);
      toast({
        title: "Account update failed",
        description: "There was an error updating your account.",
        variant: "destructive",
      });
    }
  }

  const oauthGoogleRaw = user?.oauthGoogleRaw;

  const EmailVerification = () => {
    if (!user?.email) return null;
    return (
      <div
        className="cursor-pointer"
        onClick={(event) => {
          event.preventDefault();

          if (!user?.emailVerified) {
            Api.sendVerificationEmail().catch(console.error);
            toast({
              title: "Email verification sent",
              description: "Please check your email for a verification link.",
            });
          } else {
            toast({
              title: "Email already verified",
              description: "Your email is already verified.",
            });
          }
        }}
      >
        {!user?.emailVerified ? (
          <MailQuestionIcon className="w-4 h-4 ml-1 text-red-500" />
        ) : (
          <MailCheckIcon className="w-4 h-4 ml-1 text-green-500" />
        )}
      </div>
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
            <FormField
              control={accountForm.control}
              name="birthday"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={twMerge(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={accountForm.control}
              name="picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <AccountPicture
                    value={field.value}
                    fallback={user?.username?.slice(0, 2).toUpperCase() ?? ""}
                    onChange={(file) => {
                      field.onChange(file);
                    }}
                  />
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
