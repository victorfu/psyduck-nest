import { Link, useFetcher } from 'react-router-dom';

function PageTwo() {
  const fetcher = useFetcher();
  const isLoggingOut = fetcher.formData != null;

  return (
    <div>
      <Link to="/page-one">Go to Page One</Link>
      <fetcher.Form method="post" action="/logout">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </fetcher.Form>
    </div>
  );
}

export default PageTwo;
