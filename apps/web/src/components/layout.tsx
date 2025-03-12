import {
  Outlet,
  useFetcher,
  Navigate,
  useParams,
  useLocation,
  Link,
} from "react-router-dom";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { useRootData, useWorkspacesLoaderData } from "@/hooks/use-data";
import { WorkspaceSelect } from "./workspace-select";
import { Tooltip } from "antd";
import {
  CommentOutlined,
  LineChartOutlined,
  CalendarOutlined,
  TeamOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export function Layout() {
  const rootData = useRootData();
  const loaderData = useWorkspacesLoaderData();
  const { workspaceId } = useParams();
  const fetcher = useFetcher();
  const location = useLocation();
  const currentPage = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = useMemo(
    () => [
      {
        name: "儀表板",
        href: `/workspace/${workspaceId}`,
        icon: LineChartOutlined,
        current: currentPage?.match(/^\/workspace\/[^/]+$/),
      },
      {
        name: "會員",
        href: `/workspace/${workspaceId}/members`,
        icon: TeamOutlined,
        current: currentPage?.match(/^\/workspace\/[^/]+\/members/),
      },
      {
        name: "LINE用戶",
        href: `/workspace/${workspaceId}/line-users`,
        icon: CommentOutlined,
        current: currentPage?.match(/^\/workspace\/[^/]+\/line-users/),
      },
      {
        name: "訊息排程",
        href: `/workspace/${workspaceId}/schedule-messages`,
        icon: CalendarOutlined,
        current: currentPage?.match(/^\/workspace\/[^/]+\/schedule-messages/),
      },
    ],
    [workspaceId, currentPage],
  );

  const userNavigation = useMemo(
    () => [
      { name: "帳號", href: `/workspace/${workspaceId}/settings?tab=account` },
      { name: "登出", href: "/logout" },
    ],
    [workspaceId],
  );

  const bottomNavigation = useMemo(
    () => [
      {
        name: "我的空間",
        href: `/workspace/${workspaceId}/workspaces`,
        icon: DatabaseOutlined,
        current: currentPage?.match(/^\/workspace\/[^/]+\/workspaces/),
      },
      {
        name: "設定",
        href: `/workspace/${workspaceId}/settings?tab=settings`,
        icon: SettingOutlined,
        current: currentPage?.match(/^\/workspace\/[^/]+\/settings/),
      },
    ],
    [workspaceId, currentPage],
  );

  const isLoggingOut = fetcher.formData != null;

  if (!loaderData?.workspaces || loaderData.workspaces.length === 0) {
    return <Navigate to="/" />;
  }

  const found = loaderData.workspaces.find(
    (workspace) => workspace.id === workspaceId,
  );
  if (!found) {
    return <Navigate to={`/workspace/${loaderData.workspaces[0].id}`} />;
  }

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-50 flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center justify-between">
                  <Link to="/">
                    <Logo className="h-8 w-auto" />
                  </Link>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <Link
                              to={item.href}
                              className={cn(
                                item.current
                                  ? "bg-gray-800 text-white"
                                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className="size-6 shrink-0"
                                style={{
                                  fontSize: "24px",
                                }}
                              />
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="mt-auto">
                      {bottomNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={cn(
                            item.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white",
                            "-mx-2 group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="size-6 shrink-0"
                            style={{
                              fontSize: "24px",
                            }}
                          />
                          {item.name}
                        </Link>
                      ))}
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div
          className={cn(
            "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300",
            isCollapsed ? "lg:w-20" : "lg:w-50",
          )}
        >
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center justify-between">
              <Link to="/" className={cn(isCollapsed && "justify-center")}>
                <Logo className={cn("h-8 w-auto", isCollapsed && "h-6")} />
              </Link>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="cursor-pointer hidden lg:flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              >
                {isCollapsed ? (
                  <ChevronRightIcon className="h-5 w-5" />
                ) : (
                  <ChevronLeftIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            item.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                            isCollapsed && "justify-center",
                          )}
                          title={isCollapsed ? item.name : undefined}
                        >
                          <Tooltip title={item.name}>
                            <item.icon
                              aria-hidden="true"
                              className="size-6 shrink-0"
                              style={{
                                fontSize: "24px",
                              }}
                            />
                          </Tooltip>
                          {!isCollapsed && item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  {bottomNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        item.current
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white",
                        "-mx-2 group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                        isCollapsed && "justify-center",
                      )}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Tooltip title={item.name}>
                        <item.icon
                          aria-hidden="true"
                          className="size-6 shrink-0"
                          style={{
                            fontSize: "24px",
                          }}
                        />
                      </Tooltip>
                      {!isCollapsed && item.name}
                    </Link>
                  ))}
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div
          className={cn(
            "transition-all duration-300",
            isCollapsed ? "lg:pl-16" : "lg:pl-50",
          )}
        >
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            {/* Separator */}
            <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-900/10 lg:hidden"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="grid flex-1 grid-cols-1 items-center">
                <WorkspaceSelect workspaces={loaderData.workspaces ?? []} />
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Separator */}
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <div className="size-8 rounded-full bg-gray-500"></div>
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm/6 font-semibold text-gray-900"
                      >
                        {rootData.user?.email}
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 size-5 text-gray-400"
                      />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 ring-1 shadow-lg ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    {userNavigation.map((item) => {
                      if (item.href === "/logout") {
                        return (
                          <MenuItem key={item.name}>
                            <fetcher.Form
                              method="post"
                              action="/logout"
                              className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden cursor-pointer"
                            >
                              <button
                                type="submit"
                                className="cursor-pointer w-full text-left"
                                aria-disabled={isLoggingOut}
                              >
                                {isLoggingOut ? "登出中..." : item.name}
                              </button>
                            </fetcher.Form>
                          </MenuItem>
                        );
                      }
                      return (
                        <MenuItem key={item.name}>
                          <Link
                            to={item.href}
                            className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                          >
                            {item.name}
                          </Link>
                        </MenuItem>
                      );
                    })}
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
