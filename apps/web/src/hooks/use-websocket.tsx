import { useEffect } from "react";

export function useWebSocket(callback?: (data: unknown) => void) {
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_SERVER_URL as string;
    const socket = new WebSocket(wsUrl);
    socket.onopen = function () {
      socket.onmessage = function (data) {
        callback?.(data);
      };
    };
  }, [callback]);
}
