import { useEffect } from "react";
import { useCookies } from "react-cookie";
import localForage from "localforage";
import LoadingSpinner from "@/components/ui/loading-spinner";

function AuthSuccessPage() {
  const [cookies, setCookie] = useCookies(["access_token"]);

  useEffect(() => {
    if (cookies.access_token) {
      localForage
        .setItem("access_token", cookies.access_token)
        .then(() => {
          setCookie("access_token", "", { path: "/" });
          window.location.href = "/";
        })
        .catch(console.error);
    }
  }, [cookies.access_token, setCookie]);

  return (
    <div>
      <LoadingSpinner />
    </div>
  );
}

export default AuthSuccessPage;
