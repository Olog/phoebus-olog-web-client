import { Stack, Typography, styled } from "@mui/material";
import React from "react";
import LogHeader from "./LogHeader";

const LogDetails = styled(({log, className}) => {

    return (
        <Stack gap={1} padding={1} className={`LogDetails ${className}`} width="100%" >
            <LogHeader log={log} />
            <Typography variant="h4" component="h2">{log.title}</Typography>
        </Stack>
    )

})({})

export default LogDetails;