import { authService } from "@/auth/auth-service";
import { Logo } from "@/components/logo";
import { Divider } from "antd";
import {
  Form,
  useActionData,
  useLocation,
  useNavigation,
  useNavigate,
} from "react-router-dom";

const LoginPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const from = params.get("from") ?? "/";
  const navigation = useNavigation();
  const isLoggingIn = navigation.formData?.get("username") != null;
  const actionData = useActionData() as { error: string } | undefined;
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <Logo className="h-24 w-auto" />
        </div>
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          登入
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form method="post" replace className="space-y-6">
          <input type="hidden" name="redirectTo" value={from} />
          <div>
            <label
              htmlFor="username"
              className="block text-sm/6 font-medium text-gray-900"
            >
              帳號
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="username"
                required
                autoComplete="username"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              密碼
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
          >
            {isLoggingIn ? "登入中..." : "登入"}
          </button>
          {actionData?.error && (
            <p style={{ color: "red" }}>{actionData.error}</p>
          )}
        </Form>

        <Divider />

        <button
          type="button"
          onClick={() =>
            authService.signInWithGoogle(() => {
              navigate("/");
            })
          }
          className="flex w-full items-center justify-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm/6 font-semibold text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          使用 Google 登入
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
