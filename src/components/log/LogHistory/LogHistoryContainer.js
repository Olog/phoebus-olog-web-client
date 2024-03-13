import React from "react";
import { ologApi } from "api/ologApi";
import { ServerErrorPage } from "components/shared/error";
import { LinearProgress } from "@mui/material";
import LogHistory from "./LogHistory";

const LogHistoryContainer = ({id}) => {

    const { data: currentLog, isLoading: loadingCurrentLog, error:  currentLogError } = ologApi.endpoints.getLog.useQuery({id});
    const { data: logHistory, isLoading: loadingLogHistory, error: logHistoryError } = ologApi.endpoints.getArchivedLogbooks.useQuery({id});

    if(loadingCurrentLog || loadingLogHistory) {
        return <LinearProgress width="100%" />
    }

    const renderError = (error, message) => {
        if(error.status === 404) {
            return <ServerErrorPage message={message} status={error?.code} />
        }
        return <ServerErrorPage status={error?.code} />
    }

    if(currentLogError) { return renderError(currentLogError); }
    if(logHistoryError) { return renderError(logHistoryError); }

    return (
        <LogHistory {...{currentLog, logHistory}} />
    );
}
export default LogHistoryContainer;