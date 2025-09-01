import { createContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { useCustomSnackbar } from "../hooks/useCustomSnackbar";
import customization from "src/config/customization";

export const WebSocketContext = createContext();

const BASE_URL = "Olog/web-socket";
const NEW_LOG_ENTRY = "NEW_LOG_ENTRY";
const LOG_ENTRY_UPDATED = "LOG_ENTRY_UPDATED";
const SERVICE_UNAVAILABLE = "service_unavailable";
const NETWORK_LOST = "network_lost";

export const WebSocketProvider = ({ children }) => {
  const [updatedLogEntryId, setUpdatedLogEntryId] = useState(null);
  const [refetchLogs, setRefetchLogs] = useState(0);

  const { enqueueSnackbar, closeSnackbar } = useCustomSnackbar();

  useEffect(() => {
    const handleOffline = () => {
      enqueueSnackbar("Network lost", {
        severity: "error",
        autoHideDuration: null,
        key: NETWORK_LOST
      });
    };

    const handleOnline = () => {
      setRefetchLogs((count) => count + 1);
      closeSnackbar(NETWORK_LOST);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    let disconnected = false;
    const client = new Client({
      brokerURL: `ws://${customization.APP_BASE_URL}/${BASE_URL}`,
      reconnectDelay: 5000,
      onConnect: () => {
        disconnected = false;
        closeSnackbar(SERVICE_UNAVAILABLE);
        setRefetchLogs((count) => count + 1);

        client.subscribe(`/${BASE_URL}/messages`, (message) => {
          try {
            const parsedBody = JSON.parse(message.body);
            if (parsedBody.messageType === NEW_LOG_ENTRY) {
              setRefetchLogs((count) => count + 1);
            }
            if (parsedBody.messageType === LOG_ENTRY_UPDATED) {
              setUpdatedLogEntryId(parsedBody.payload);
            }
          } catch (e) {
            console.error("Failed to parse websocket message", e);
          }
        });
      },
      onWebSocketClose: () => {
        if (!disconnected) {
          enqueueSnackbar("Service unavailable", {
            severity: "error",
            autoHideDuration: null,
            key: SERVICE_UNAVAILABLE
          });
        }
        disconnected = true;
      },
      onStompError: (frame) => {
        console.error("STOMP Error:", frame);
      },
      debug: (str) => console.debug("STOMP Debug:", str)
    });

    client.activate();

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      client.deactivate();
    };
  }, [enqueueSnackbar, closeSnackbar]);

  const value = {
    updatedLogEntryId,
    refetchLogs
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
