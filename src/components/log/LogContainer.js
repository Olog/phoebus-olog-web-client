import React, { useEffect } from "react";
import { useGetLogbookQuery } from "services/ologApi";
import { ServerErrorPage } from "components/ErrorPage";
import { LinearProgress } from "@mui/material";
import { checkSession } from "api/olog-service";

const LogContainer = ({id, renderLog, setShowLogin}) => {

    const { data: log, isLoading, error } = useGetLogbookQuery({id});

    /**
     * Show login if no session
     */
    useEffect(() => {
        const promise = checkSession();
        if(!promise){
            setShowLogin(true);
        }
        else{
            promise.then(data => {
                if(!data){
                    setShowLogin(true);
                }
            });
        }
    }, [setShowLogin])

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
        renderLog(log)
    );
}
export default LogContainer;