import { useContext } from "react";
import { WebSocketContext } from "src/providers/WebSocketProvider";

export const useWebSockets = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
