import { Box, Stack, Typography, styled } from "@mui/material";
import { theme } from "beta/config/theme";
import { InternalLink } from "components/shared/Link";
import { formatFullDateTime } from "lib/moment";
import React from "react";
import AttachmentsGallery from "./AttachmentsGallery";
import OlogAttachment from "components/log/EntryEditor/Description/OlogAttachment";

const Key = styled(Typography)({
    fontWeight: "bold",
    gridColumn: "span / span"
});
const Value = styled(Typography)({
    gridColumn: "span / span"
});

const CreatedDate = ({log}) => {
    return (
        <Typography component="span" >
            {log.modifyDate 
            ? (
                <>
                    {formatFullDateTime(log.modifyDate)}
                    {" "}
                    <InternalLink to={`/logs/${log.id}/history`}>(edited)</InternalLink>
                </>
            )
            : formatFullDateTime(log.createdDate)}
        </Typography>
    )
}

const LogHeader = ({log}) => {

    return (
        <Stack 
            gap={1}
            sx={{
                bgcolor: `${theme.palette.primary.main}10`,
                borderLeft: `${theme.palette.primary.main} solid 5px`,
                padding: 2
            }}
        >
            <Typography variant="button" component="h3" >Log Information</Typography>
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "max-content max-content max-content max-content",
                columnGap: 2
            }}>
                <Key>Author</Key><Value>{log.owner}</Value>
                <Key>Created</Key><Value><CreatedDate log={log} /></Value>
                <Key>Logbooks</Key><Value>{log?.logbooks.map(it => it.name).join(", ")}</Value>
                <Key>Tags</Key><Value>{log?.tags.map(it => it.name).join(", ")}</Value>
                <Key>Entry Type</Key><Value>{log.level}</Value>
            </Box>
            <Typography fontWeight="bold" >Attachments</Typography>
            <AttachmentsGallery attachments={log?.attachments?.map(it => new OlogAttachment({attachment: it})) ?? []} />
        </Stack>
    );
}

export default LogHeader;