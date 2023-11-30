import { Stack, Typography, styled } from "@mui/material";
import React from "react";
import LogHeader from "./LogHeader";
import CommonmarkPreview from "components/shared/CommonmarkPreview";
import customization from "config/customization";
import LogProperty from "./LogProperty";

const LogDetails = styled(({log, className}) => {

    return (
        <Stack 
            className={`LogDetails ${className}`} 
            gap={1} 
            padding={1} 
            sx={{ 
                overflow: "scroll"
            }} 
        >
            <LogHeader log={log} />
            <Typography variant="h4" component="h2">{log.title}</Typography>
            <CommonmarkPreview commonmarkSrc={log.source} imageUrlPrefix={customization.APP_BASE_URL + "/"} />
            { log?.properties
                ?.filter(it => it.name.toLowerCase() !== "log entry group" && it.state.toLowerCase() === "active")
                ?.map(it => <LogProperty property={it} key={it.name} />)
            }
        </Stack>
    )

})({})

export default LogDetails;