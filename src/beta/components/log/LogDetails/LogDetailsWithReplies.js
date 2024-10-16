import React, { useState } from "react";
import { ologApi } from "api/ologApi";
import { getLogEntryGroupId } from "components/Properties";
import { sortByCreatedDate } from "components/log/sort";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Box,
    CircularProgress,
    Divider,
    Stack,
    styled
} from "@mui/material";
import LogDetails from "./LogDetails";
import { useSearchPageParams } from "features/searchPageParamsReducer";
import LogHeader from "./LogHeader";

const StyledLogHeader = styled(LogHeader)({
    width: "100%"
});

const LogDetailsAccordion = styled(({ log, defaultExpanded = false, className }) => {

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
                aria-controls={`${log.id}-content`}
                id={`${log.id}-header`}
                sx={{
                    bgcolor: "grey.100"
                }}
            >
                <StyledLogHeader log={log} />
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

const LogDetailsWithReplies = ({ log }) => {

    // fetch any groups/conversations
    const groupId = getLogEntryGroupId(log.properties);
    const {
        data: replies = [],
        isLoading: repliesLoading,
        error: repliesError
    } = ologApi.endpoints.getLogGroup.useQuery({ groupId });

    const { dateDescending } = useSearchPageParams();

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
        ].toSorted(sortByCreatedDate(dateDescending));

        return (
            <Stack divider={<Divider flexItem />} sx={{
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
        <Stack>
            <Box padding={2}>
                <LogHeader log={log} />
            </Box>
            <LogDetails log={log} />
        </Stack>
    )

}

export default LogDetailsWithReplies;