import { Link, useLoaderData } from "react-router-dom";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

function WorkspacePage() {
  const { workspaces } = useLoaderData() as {
    workspaces: Workspace[];
  };

  return (
    <div>
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
      >
        {workspaces.map((w) => {
          return (
            <Link to={`/workspaces/${w.id}`} key={w.id}>
              <li className="overflow-hidden rounded-xl border border-gray-200">
                <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    {w.name}
                  </div>
                  <Menu as="div" className="relative ml-auto">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Open options</span>
                      <EllipsisHorizontalIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
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
                      <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={twMerge(
                                active ? "bg-gray-50" : "",
                                "block px-3 py-1 text-sm leading-6 text-gray-900",
                              )}
                            >
                              View<span className="sr-only">, {w.name}</span>
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={twMerge(
                                active ? "bg-gray-50" : "",
                                "block px-3 py-1 text-sm leading-6 text-gray-900",
                              )}
                            >
                              Edit<span className="sr-only">, {w.name}</span>
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Created time</dt>
                    <dd className="text-gray-700">
                      <time dateTime={new Date(w.createdAt).toISOString()}>
                        {format(w.createdAt, "yyyy/MM/dd HH:mm:ss")}
                      </time>
                    </dd>
                  </div>
                </dl>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
}

export default WorkspacePage;
