import React from "react";
import { useGetLogbookQuery } from "api/ologApi";
import { ServerErrorPage } from "components/ErrorPage";
import { LinearProgress } from "@mui/material";

const LogContainer = ({id, renderLog}) => {

    const { data: log, isLoading, error } = useGetLogbookQuery({id});
    
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
        renderLog({log})
    );
}
export default LogContainer;