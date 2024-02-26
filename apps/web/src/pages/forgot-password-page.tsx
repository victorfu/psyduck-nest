import { Form, useActionData, useNavigation } from "react-router-dom";
import logo from "/logo.png";

function ForgotPasswordPage() {
  const navigation = useNavigation();
  const isSubmitting = navigation.formData?.get("email") != null;
  const actionData = useActionData() as
    | { message: string; error: string }
    | undefined;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-20 w-auto" src={logo} alt="Psyduck" />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Forgot Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <Form className="space-y-6" method="POST" replace>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  autoComplete="off"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              {actionData?.error ? (
                <p style={{ color: "red" }}>{actionData.error}</p>
              ) : null}
              {actionData?.message ? (
                <p style={{ color: "green" }}>{actionData.message}</p>
              ) : null}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
