import React, { useEffect } from "react";
import { ologApi } from "api/ologApi";
import { ServerErrorPage } from "components/shared/error";
import { LinearProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateCurrentLogEntry } from "features/currentLogEntryReducer";

const LogContainer = ({ id, renderLog }) => {
  const {
    data: log,
    isLoading,
    error,
  } = ologApi.endpoints.getLog.useQuery({ id }, { refetchOnFocus: true });

  const dispatch = useDispatch();
  useEffect(() => {
    if (log) {
      dispatch(updateCurrentLogEntry(log));
    }
  }, [dispatch, log]);

  if (isLoading) {
    return <LinearProgress width="100%" />;
  }

  if (error) {
    if (error.status === 404) {
      return <ServerErrorPage message={`Log not found`} status={error?.code} />;
    }
    return <ServerErrorPage status={error?.code} />;
  }

  return renderLog({ log });
};
export default LogContainer;
