import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWorkspaceData } from "@/hooks/use-root-user";
import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { InfoForm } from "./info-form";
import { DisplayForm } from "./display-form";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const location = useLocation();
  const { pathname } = location;

  return (
    <nav
      className={twMerge(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={twMerge(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

interface SettingsLayoutProps {
  children: React.ReactNode;
}

function SettingsLayout({ children }: SettingsLayoutProps) {
  const location = useLocation();
  const { pathname } = location;
  const wid = pathname.split("/")[2];

  const sidebarNavItems = [
    {
      title: "Information",
      href: `/workspaces/${wid}/settings/info`,
    },
    {
      title: "Display",
      href: `/workspaces/${wid}/settings/display`,
    },
  ];

  return (
    <>
      <div className="md:hidden"></div>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your workspace settings and preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}

interface FormWrapperProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function FormWrapper({ title, description, children }: FormWrapperProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Separator />
      {children}
    </div>
  );
}

const renderTab = (workspace: Workspace, tab: string) => {
  switch (tab) {
    case "info":
      return (
        <FormWrapper
          title="Information"
          description="Update your workspace information."
        >
          <InfoForm workspace={workspace} />
        </FormWrapper>
      );
    case "display":
      return (
        <FormWrapper
          title="Display"
          description="Update your workspace display."
        >
          <DisplayForm />
        </FormWrapper>
      );
    default:
      return (
        <FormWrapper
          title="Information"
          description="Update your workspace information."
        >
          <InfoForm workspace={workspace} />
        </FormWrapper>
      );
  }
};

function WorkspaceSettingsPage() {
  const { workspace } = useWorkspaceData();
  const location = useLocation();
  const { pathname } = location;

  // /workspaces/:wid/settings/:tab
  const tab = pathname.split("/")[4];
  return <SettingsLayout>{renderTab(workspace, tab)}</SettingsLayout>;
}

export default WorkspaceSettingsPage;
