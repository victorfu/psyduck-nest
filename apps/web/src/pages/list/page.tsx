import { Link, useLoaderData } from "react-router-dom";
import { format } from "date-fns";
import { CheckIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Empty = () => {
  return (
    <div className="text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        No workspaces
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new workspace.
      </p>
      <div className="mt-6">
        <Button>
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New workspace
        </Button>
      </div>
    </div>
  );
};

function WorkspaceListPage() {
  const { workspaces } = useLoaderData() as {
    workspaces: Workspace[];
  };

  if (workspaces.length === 0) {
    return <Empty />;
  }

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
                <div className="flex gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    {w.name}
                  </div>
                  <div className="text-sm leading-6 text-gray-500">
                    {w.description}
                  </div>
                  <div className="relative ml-auto">
                    <CheckIcon
                      className="h-5 w-5 text-green-500"
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Manager</dt>
                    <dd className="flex items-start gap-x-2">
                      <div className="font-medium text-gray-900">
                        {w.manager}
                      </div>
                    </dd>
                  </div>
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

export default WorkspaceListPage;
