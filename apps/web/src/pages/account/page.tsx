import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountForm from "./account-form";
import PasswordForm from "./password-form";
import GoogleLogo from "@/svg/google-logo";
import { useRootUser } from "@/hooks/use-root-user";

function AccountPage() {
  const { user } = useRootUser();
  const oauthGoogleRaw = user?.oauthGoogleRaw;

  const GoogleStatus = () => {
    if (!oauthGoogleRaw) return null;

    const oauthGoogleJson = JSON.parse(oauthGoogleRaw);

    return (
      <div className="w-[380px] flex items-center space-x-4 rounded-md border p-4 mb-4">
        <GoogleLogo className="w-5 h-5 ml-2" />
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">
            This account is linked to Google.
          </p>
          <p className="text-sm text-muted-foreground">
            Email: {oauthGoogleJson.email}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <GoogleStatus />
      <Tabs defaultValue="account" className="w-[380px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountForm />
        </TabsContent>
        <TabsContent value="password">
          <PasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AccountPage;
