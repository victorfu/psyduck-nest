import { useRootData, useWorkspacesLoaderData } from "@/hooks/use-data";
import { addWorkspace } from "@/lib/workspace";
import { Form, Input, Button } from "antd";
import { useFetcher, Link, useRevalidator } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Timestamp } from "firebase/firestore";

const userNavigation = [{ name: "登出", href: "/logout" }];

function MainPage() {
  const rootData = useRootData();
  const loaderData = useWorkspacesLoaderData();
  const fetcher = useFetcher();
  const revalidator = useRevalidator();

  const onFinish = async (values: { name: string }) => {
    if (!rootData.user?.uid) {
      return;
    }

    const now = new Date();
    const timestamp = Timestamp.fromDate(now);
    try {
      await addWorkspace({
        name: values.name,
        createdBy: rootData.user.uid,
        createdAt: timestamp,
        updatedBy: rootData.user.uid,
        updatedAt: timestamp,
        uids: [rootData.user.uid],
      });
      revalidator.revalidate();
    } catch (error) {
      console.error(error);
    }
  };

  const isLoggingOut = fetcher.formData != null;

  if (loaderData?.workspaces && loaderData.workspaces.length > 0) {
    return null;
  }

  return (
    <div>
      <div className="w-full">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="grid flex-1 grid-cols-1 items-center"></div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
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
            <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  建立你的第一個工作空間
                </h2>
                <p className="mt-2 mb-4 text-center text-sm text-gray-600">
                  開始使用前，請先建立一個工作空間
                </p>
                <Form onFinish={onFinish}>
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: "請輸入工作空間名稱" }]}
                  >
                    <Input placeholder="輸入工作空間名稱" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">
                      建立
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MainPage;
