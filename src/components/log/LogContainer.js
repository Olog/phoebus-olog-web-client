import React from "react";
import { ologApi } from "api/ologApi";
import { ServerErrorPage } from "components/ErrorPage";
import { LinearProgress } from "@mui/material";
import useIsAuthenticated from "hooks/useIsAuthenticated";

const LogContainer = ({id, renderLog}) => {

    const { data: log, isLoading, error } = ologApi.endpoints.getLog.useQuery({id});
    
    const [isAuthenticated] = useIsAuthenticated();

    if(isLoading) {
        return <LinearProgress width="100%" />
    }

    if(error) {
        if(error.status === 404) {
            return <ServerErrorPage message={`Log not found`} status={error?.code} />
        }
        return <ServerErrorPage status={error?.code} />
    }

    return (
        renderLog({log, isAuthenticated})
    );
}
export default LogContainer;