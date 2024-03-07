import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { Toaster } from "@/components/ui/toaster";
import { TailwindIndicator } from "@/components/ui/tailwind-indicator";
import { useRootUser } from "../hooks/use-root-user";
import { PanelLeftCloseIcon, PanelRightCloseIcon, XIcon } from "lucide-react";
import routes from "../routes";
import Logo from "./logo";
import LayoutHeader from "./layout-header";

function Layout() {
  const location = useLocation();
  const { pathname } = location;
  const { user } = useRootUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fullSidebar, setFullSidebar] = useState(true);

  const navigation = routes
    .filter(([, value]) => value.isPrimary)
    .map(([, value]) => ({
      ...value,
      current: pathname.includes(value.href),
    }));

  const secondaryNavigation = routes
    .filter(([, value]) => value.isSecondary)
    .map(([, value]) => ({
      ...value,
      current: pathname.includes(value.href),
    }));

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
                    <Link to="/" className="flex h-16 shrink-0 items-center">
                      <Logo />
                    </Link>
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
                <Link to="/" className="flex h-16 shrink-0 items-center">
                  <Logo />
                </Link>
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

        <div className={fullSidebar ? "lg:pl-52" : "lg:pl-16"}>
          <LayoutHeader user={user} onClick={() => setSidebarOpen(true)} />

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
