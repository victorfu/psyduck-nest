import { useEffect } from "react";

export function useWebSocket(callback?: (data: unknown) => void) {
  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WS_SERVER_URL);
    socket.onopen = function () {
      socket.onmessage = function (data) {
        callback?.(data);
      };
    };
  }, [callback]);
}
