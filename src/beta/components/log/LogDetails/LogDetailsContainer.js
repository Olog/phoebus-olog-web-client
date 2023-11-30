import { Stack, Typography, styled } from "@mui/material";
import LogContainer from "components/log/LogContainer";
import React from "react";
import LogDetails from "./LogDetails";

const LogDetailsContainer = styled(({id}) => {

    let renderedContent = (
        <LogContainer 
            id={id}
            renderLog={({log}) => <LogDetails log={log} /> }
        />
    )

    if(!id) {
        renderedContent = (
            <Stack justifyContent="center">
                <Typography>Select a log to view its details</Typography>
            </Stack>
        )
    }

    return (
        <>
            {renderedContent}
        </>
    )
})({})

export default LogDetailsContainer;