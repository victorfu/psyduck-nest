import "./layout.css";
import logo from "/logo.png";
import { useState } from "react";
import { Link, Outlet, useFetcher, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, FolderIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";
import { Toaster } from "@/components/ui/toaster";
import { TailwindIndicator } from "@/components/ui/tailwind-indicator";
import { useWebSocket } from "./hooks/use-websocket";
import { useRootUser } from "./hooks/use-root-user";
import {
  BarChart2Icon,
  BookUserIcon,
  Building2Icon,
  CircleUserIcon,
  FolderKanbanIcon,
  LogOutIcon,
  PanelLeftCloseIcon,
  PanelRightCloseIcon,
  SettingsIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const routes = {
  myworkspace: {
    name: "My Workspaces",
    href: "/my-workspaces",
    icon: FolderKanbanIcon,
    isPrimary: true,
    isSecondary: false,
    isAdmin: false,
    isMenu: false,
  },
  dashboard: {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart2Icon,
    isPrimary: false,
    isSecondary: false,
    isAdmin: true,
    isMenu: false,
  },
  organization: {
    name: "Organizations",
    href: "/organizations",
    icon: Building2Icon,
    isPrimary: false,
    isSecondary: false,
    isAdmin: true,
    isMenu: false,
  },
  workspaces: {
    name: "Workspaces",
    href: "/workspaces",
    icon: FolderIcon,
    isPrimary: false,
    isSecondary: false,
    isAdmin: true,
    isMenu: false,
  },
  clients: {
    name: "Clients",
    href: "/clients",
    icon: BookUserIcon,
    isPrimary: false,
    isSecondary: false,
    isAdmin: true,
    isMenu: false,
  },
  users: {
    name: "Users",
    href: "/users",
    icon: UsersIcon,
    isPrimary: false,
    isSecondary: false,
    isAdmin: true,
    isMenu: false,
  },
  settings: {
    name: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    isPrimary: false,
    isSecondary: true,
    isAdmin: false,
    isMenu: false,
  },
  account: {
    name: "Account",
    href: "/account",
    icon: CircleUserIcon,
    isPrimary: false,
    isSecondary: false,
    isAdmin: false,
    isMenu: true,
  },
  signout: {
    name: "Sign out",
    href: "/signout",
    icon: LogOutIcon,
    isPrimary: false,
    isSecondary: false,
    isAdmin: false,
    isMenu: true,
  },
};

const entries = Object.entries(routes);

function Layout() {
  const location = useLocation();
  const { pathname } = location;
  const { user } = useRootUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fetcher = useFetcher();
  const isLoggingOut = fetcher.formData != null;
  const isAdmin = user?.roles.includes("admin");
  const [fullSidebar, setFullSidebar] = useState(true);

  useWebSocket();

  const navigation = entries
    .filter(([, value]) => value.isPrimary)
    .map(([, value]) => ({
      ...value,
      current: pathname === value.href,
    }));

  const secondaryNavigation = entries
    .filter(([, value]) => value.isSecondary)
    .map(([, value]) => ({
      ...value,
      current: pathname === value.href,
    }));

  const userNavigation = entries
    .filter(([, value]) => value.isMenu)
    .map(([key, value]) => ({
      ...value,
      key: key,
    }));

  const adminNavigation = isAdmin
    ? entries
        .filter(([, value]) => value.isAdmin)
        .map(([, value]) => ({
          ...value,
          current: pathname === value.href,
        }))
    : [];

  return (
    <>
      <div className="h-screen">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto logo"
                        src={logo}
                        alt="psyduck"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  to={item.href}
                                  className={twMerge(
                                    item.current
                                      ? "bg-gray-800 text-white"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                        {
                          // Admin navigation
                          isAdmin && (
                            <li>
                              <div className="text-xs font-semibold leading-6 text-indigo-200">
                                Administration
                              </div>
                              <ul role="list" className="-mx-2 mt-2 space-y-1">
                                {adminNavigation.map((item) => (
                                  <li key={item.name}>
                                    <a
                                      href={item.href}
                                      className={twMerge(
                                        item.current
                                          ? "bg-gray-800 text-white"
                                          : "text-gray-400 hover:text-white hover:bg-gray-800",
                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                        fullSidebar ? "p-2" : "p-1",
                                      )}
                                    >
                                      <item.icon
                                        className="h-6 w-6 shrink-0"
                                        aria-hidden="true"
                                      />
                                      {fullSidebar && item.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          )
                        }

                        <div className="mt-auto">
                          {secondaryNavigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                className={twMerge(
                                  item.current
                                    ? "bg-gray-800 text-white"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                )}
                              >
                                <item.icon
                                  className="h-6 w-6 shrink-0"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </div>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div
          className={twMerge(
            "hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col",
            fullSidebar ? "lg:w-52" : "lg:w-16",
          )}
        >
          {/* Sidebar component */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <div className="flex-1 w-full">
                <img className="h-8 w-auto logo" src={logo} alt="psyduck" />
              </div>
              <button onClick={() => setFullSidebar(!fullSidebar)}>
                {fullSidebar ? (
                  <PanelLeftCloseIcon className="h-5 w-5 text-white " />
                ) : (
                  <PanelRightCloseIcon className="h-5 w-5 text-white " />
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
                          className={twMerge(
                            item.current
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                            fullSidebar ? "p-2" : "p-1",
                          )}
                        >
                          <item.icon
                            className="h-6 w-6 shrink-0"
                            aria-hidden="true"
                          />
                          {fullSidebar && item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                {
                  // Admin navigation
                  isAdmin && (
                    <li>
                      <div className="text-xs font-semibold leading-6 text-indigo-200">
                        Administration
                      </div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {adminNavigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={twMerge(
                                item.current
                                  ? "bg-gray-800 text-white"
                                  : "text-gray-400 hover:text-white hover:bg-gray-800",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                fullSidebar ? "p-2" : "p-1",
                              )}
                            >
                              <item.icon
                                className="h-6 w-6 shrink-0"
                                aria-hidden="true"
                              />
                              {fullSidebar && item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )
                }
                <div className="mt-auto">
                  {secondaryNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={twMerge(
                          item.current
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-800",
                          "-mx-2 group flex gap-x-3 rounded-md text-sm leading-6 font-semibold",
                          fullSidebar ? "p-2" : "p-1",
                        )}
                      >
                        <item.icon
                          className="h-6 w-6 shrink-0"
                          aria-hidden="true"
                        />
                        {fullSidebar && item.name}
                      </Link>
                    </li>
                  ))}
                </div>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-60">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex-1" />
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                {/* Separator */}
                <div
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                  aria-hidden="true"
                />
                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <Menu.Button className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    {/* <div className="h-8 w-8 rounded-full bg-gray-200"></div> */}
                    <Avatar>
                      <AvatarImage src={user?.picture} alt="avatar" />
                      <AvatarFallback>
                        {user?.username?.at(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                        aria-hidden="true"
                      >
                        {user?.username}
                      </span>
                      <ChevronDownIcon
                        className="ml-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => {
                            if (item.key === "signout") {
                              return (
                                <fetcher.Form
                                  method="post"
                                  action="/logout"
                                  className={twMerge(
                                    active ? "bg-gray-50" : "",
                                    "block px-3 py-1 text-sm leading-6 text-gray-900",
                                  )}
                                >
                                  <div className="flex items-center w-full">
                                    <item.icon
                                      className="h-4 w-4 shrink-0 mr-1"
                                      aria-hidden="true"
                                    />
                                    <button
                                      type="submit"
                                      disabled={isLoggingOut}
                                      className="w-full text-start"
                                    >
                                      {isLoggingOut
                                        ? "Signing out..."
                                        : "Sign out"}
                                    </button>
                                  </div>
                                </fetcher.Form>
                              );
                            }

                            return (
                              <Link
                                to={item.href}
                                className={twMerge(
                                  active ? "bg-gray-50" : "",
                                  "block px-3 py-1 text-sm leading-6 text-gray-900",
                                )}
                              >
                                <div className="flex items-center w-full">
                                  <item.icon
                                    className="h-4 w-4 shrink-0 mr-1"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </div>
                              </Link>
                            );
                          }}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
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
      <Toaster />
      <TailwindIndicator />
    </>
  );
}

export default Layout;
