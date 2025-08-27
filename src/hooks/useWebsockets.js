import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

const BASE_URL = "Olog/web-socket";

const messageTypes = {
  NEW_LOG_ENTRY: "NEW_LOG_ENTRY",
  LOG_ENTRY_UPDATED: "LOG_ENTRY_UPDATED"
};

export const useWebsockets = () => {
  const [updatedLogEntryId, setUpdatedLogEntryId] = useState(null);
  const [refetchLogs, setRefetchLogs] = useState(0);

  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://localhost:8080/${BASE_URL}`,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/${BASE_URL}/messages`, (message) => {
          try {
            const parsedBody = JSON.parse(message.body);
            if (parsedBody.messageType === messageTypes.NEW_LOG_ENTRY) {
              setRefetchLogs((count) => count + 1);
            }
            if (parsedBody.messageType === messageTypes.LOG_ENTRY_UPDATED) {
              setUpdatedLogEntryId(parsedBody.payload);
            }
          } catch (e) {
            console.error("Failed to parse websocket message", e);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Error:", frame);
      },
      onDisconnect: () => {
        console.info("Disconnected");
      },
      debug: (str) => console.debug("debug:", str)
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return { updatedLogEntryId, refetchLogs };
};
