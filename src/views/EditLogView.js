import EditLog from "components/log/EditLog";
import LogContainer from "components/log/LogContainer";
import React from "react";
import { useParams } from "react-router-dom";

const EditLogView = () => {
  const { id } = useParams();

  return (
    <LogContainer
      id={id}
      renderLog={({ log, isAuthenticated }) => (
        <EditLog {...{ log, isAuthenticated }} />
      )}
    />
  );
};
export default EditLogView;
