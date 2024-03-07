import { Link, useFetcher } from "react-router-dom";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import routes from "@/routes";
import { LockIcon } from "lucide-react";

const userNavigation = routes
  .filter(([, value]) => value.isMenu)
  .map(([key, value]) => ({
    ...value,
    key: key,
  }));

export function AccountMenu({ user }: { user: User }) {
  const fetcher = useFetcher();
  const isLoggingOut = fetcher.formData != null;
  const isAdmin = user?.roles.includes("admin");

  return (
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
          {isAdmin && (
            <Menu.Item>
              {({ active }) => {
                return (
                  <Link
                    to={"/admin"}
                    className={twMerge(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900",
                    )}
                  >
                    <div className="flex items-center w-full text-orange-600">
                      <LockIcon
                        className="h-4 w-4 shrink-0 mr-1"
                        aria-hidden="true"
                      />
                      Manage
                    </div>
                  </Link>
                );
              }}
            </Menu.Item>
          )}
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
                          {isLoggingOut ? "Signing out..." : "Sign out"}
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
  );
}
