import React from "react";
import { Stack, Typography, styled } from "@mui/material";
import ReplyIcon from '@mui/icons-material/Reply';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { getLogEntryGroupId } from "components/Properties";
import FormattedDate from "components/shared/FormattedDate";

const SearchResultItemRow = styled(({log, className}) => {

    const isGroupEntry = getLogEntryGroupId(log.properties);

    return (
        <Stack className={className} paddingLeft={1} width="100%">
            <Stack flexDirection="row" justifyContent="space-between" >
                <FormattedDate 
                    date={log.createdDate}
                    formatVariant="shortTime"
                    color="primary" 
                    fontWeight="bold" 
                    lineHeight={1}
                />
                <Stack flexDirection="row" >
                    {isGroupEntry ? <ReplyIcon titleAccess="grouped" role="status" /> : null}
                    {log.attachments && log.attachments.length  !== 0 ? <AttachFileIcon titleAccess='has attachments' role='status' /> : null}
                </Stack>
            </Stack>
            <Typography fontWeight="bold" paddingBottom={1} noWrap >
                {log.title}
            </Typography>
            <Typography variant="body2" noWrap lineHeight={1}>
                {log.description}
            </Typography>
            <Stack flexDirection="row" gap={1}>
                {log?.tags?.map(tag => 
                    <Typography variant="body2" color="primary" key={tag.name} >
                        #{tag.name}
                    </Typography>
                )}
            </Stack>
        </Stack>
    )

})({});

export default SearchResultItemRow;