import React from "react";
import { useGetLogbookQuery } from "api/ologApi";
import { ServerErrorPage } from "components/ErrorPage";
import { LinearProgress } from "@mui/material";
import useIsAuthenticated from "hooks/useIsAuthenticated";

const LogContainer = ({id, renderLog, setShowLogin}) => {

    const { data: log, isLoading, error } = useGetLogbookQuery({id});
    
    const [isAuthenticated] = useIsAuthenticated({setShowLogin});

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