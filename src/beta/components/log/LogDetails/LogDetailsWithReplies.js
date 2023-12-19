import React, { useState } from "react";
import { ologApi } from "api/ologApi";
import { getLogEntryGroupId } from "components/Properties";
import { sortByCreatedDate } from "components/log/sort";
import { useSelector } from "react-redux";
import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, CircularProgress, Divider, Stack, Typography, styled } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { moment } from "lib/moment";
import LogDetails from "./LogDetails";
import AttachFileIcon from '@mui/icons-material/AttachFile';

const LogDetailsAccordion = styled(({log, defaultExpanded=false, className}) => {

    const [expanded, setExpanded] = useState(defaultExpanded);

    const onChange = () => {
        setExpanded((prev) => !prev)
    }

    return (
        <Accordion 
            defaultExpanded={false}
            expanded={expanded}
            onChange={onChange}
            variant="outlined"
            square
            className={className}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${log.id}-content`}
                id={`${log.id}-header`}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gridTemplateRows: "1fr 1fr",
                        gap: 1,
                        width: "100%"
                    }}
                >
                        <Typography variant="body1" fontWeight="bold">{log.title}</Typography>
                        <Stack flexDirection="row" justifyContent="flex-end" gap={0.5}>
                            {log?.attachments?.length > 0 ? <AttachFileIcon /> : null }
                        </Stack>
                        <Typography variant="body2" fontWeight="italic">{log.description?.slice(0, 100)}...</Typography>
                        <Typography variant="button">{moment(log.createdDate).format("YYYY-MM-DD HH:MM")}</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <LogDetails log={log} />
            </AccordionDetails>
        </Accordion>
    )

})({
    border: "none",
    margin: "0 !important",
    // Get rid of the small line above the accordion
    "&:before": {
        display: "none",
    }
})

const LogDetailsWithReplies = ({log}) => {

    // fetch any groups/conversations
    const groupId = getLogEntryGroupId(log.properties);
    const {
        data: replies = [],
        isLoading: repliesLoading,
        error: repliesError
    } = ologApi.endpoints.getLogGroup.useQuery({groupId});

    const { sort } = useSelector(state => state.searchPageParams);

    if (repliesLoading) {
        return <CircularProgress /> 
    }

    if (repliesError) {
        console.error(`Unable to fetch replies for log ${log.id}`, repliesError);
        return <Alert color="error">Unable to fetch replies, {repliesError.code}: {repliesError.message}</Alert>
    }

    if (replies?.length > 0) {

        const sortedLogs = [
            log,
            ...replies.filter(it => it.id !== log.id)
        ].toSorted(sortByCreatedDate(sort === "down"));
        
        return (
            <Stack gap={1} divider={<Divider flexItem />} sx={{
                overflow: "auto"
            }}>
                {sortedLogs.map(sortedLog => <LogDetailsAccordion 
                    log={sortedLog} 
                    defaultExpanded={sortedLog.id === log.id} 
                    key={`current-${log.id}-accordion-${sortedLog.id}`} 
                />)}
            </Stack>
        )
    }
    
    return (
        <LogDetails log={log} />
    )

}

export default LogDetailsWithReplies;