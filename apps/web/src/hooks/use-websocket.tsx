import { useEffect } from "react";

export function useWebSocket(callback?: (data: unknown) => void) {
  useEffect(() => {
    const protocol = "ws://";
    const wsUrl = `${protocol}${window.location.hostname}:${window.location.port}/ws`;
    const socket = new WebSocket(wsUrl);
    socket.onopen = function () {
      console.log("Connected to WebSocket server");
      socket.onmessage = function (data) {
        callback?.(data);
      };
    };
  }, [callback]);
}
