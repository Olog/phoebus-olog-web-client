import { createContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Client } from "@stomp/stompjs";
import { useCustomSnackbar } from "../hooks/useCustomSnackbar";
import customization from "src/config/customization";
import { editPageRegex } from "src/hooks/onPage";
import { ologApi, TagTypes } from "src/api/ologApi";

export const WebSocketContext = createContext();

const getBasePath = () => {
  try {
    const url = new URL(customization.WEBSOCKET_BASE_URL);
    return url.pathname;
  } catch (error) {
    console.error("Invalid websocket base url:", error);
    return null;
  }
};

const BASE_PATH = getBasePath() || "";
const NEW_LOG_ENTRY = "NEW_LOG_ENTRY";
const LOG_ENTRY_UPDATED = "LOG_ENTRY_UPDATED";
const SERVICE_UNAVAILABLE = "service_unavailable";
const NETWORK_LOST = "network_lost";

export const WebSocketProvider = ({ children }) => {
  const [updatedLogEntryId, setUpdatedLogEntryId] = useState(null);
  const dispatch = useDispatch();

  const { enqueueSnackbar, closeSnackbar } = useCustomSnackbar();

  useEffect(() => {
    const refetchLogs = () => {
      setTimeout(
        () => {
          dispatch(ologApi.util.invalidateTags([{ type: TagTypes.GetLogs }]));
        },
        Math.floor(Math.random() * 5001)
      );
    };

    const handleOffline = () => {
      enqueueSnackbar("Network lost", {
        severity: "error",
        autoHideDuration: null,
        key: NETWORK_LOST
      });
    };

    const handleOnline = () => {
      refetchLogs();
      closeSnackbar(NETWORK_LOST);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    let disconnected = false;
    const client = new Client({
      brokerURL: customization.WEBSOCKET_BASE_URL ?? "ws://localhost:8080/",
      reconnectDelay: 5000,
      onConnect: () => {
        disconnected = false;
        closeSnackbar(SERVICE_UNAVAILABLE);
        refetchLogs();

        client.subscribe(`${BASE_PATH}/messages`, (message) => {
          try {
            const parsedBody = JSON.parse(message.body);
            if (parsedBody.messageType === NEW_LOG_ENTRY) {
              refetchLogs();
            }
            if (parsedBody.messageType === LOG_ENTRY_UPDATED) {
              refetchLogs();
              if (editPageRegex.test(window.location.pathname)) {
                setUpdatedLogEntryId(parsedBody.payload);
              }
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
  }, [enqueueSnackbar, closeSnackbar, dispatch]);

  const value = {
    updatedLogEntryId,
    setUpdatedLogEntryId
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
