import Api from "@/lib/api";
import { useEffect, useState } from "react";

export function useVersion() {
  const [version, setVersion] = useState<string>("");

  useEffect(() => {
    Api.version()
      .then((response) => {
        setVersion(response.version);
      })
      .catch(console.error);
  }, []);

  return version;
}
