import ReplyLog from "components/log/ReplyLog";
import LogContainer from "components/log/LogContainer";
import React from "react";
import { useParams } from "react-router-dom";

const ReplyLogView = () => {
  const { id } = useParams();

  return (
    <LogContainer
      id={id}
      renderLog={({ log, isAuthenticated }) => (
        <ReplyLog {...{ log, isAuthenticated }} />
      )}
    />
  );
};
export default ReplyLogView;
