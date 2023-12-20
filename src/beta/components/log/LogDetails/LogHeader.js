import { Stack, Typography, styled } from "@mui/material";
import { InternalLink } from "components/shared/Link";
import React from "react";
import AttachmentsGallery from "./AttachmentsGallery";
import OlogAttachment from "components/log/EntryEditor/Description/OlogAttachment";
import MetadataTable from "./MetadataTable";
import LogDetailActionButton from "./LogDetailActionButton";
import FormattedDate from "components/shared/FormattedDate";

const CreatedDate = ({log}) => {

    if(log.modifyDate) {
        return (
            <>
                <FormattedDate date={log.modifyDate} component="span" />
                {" "}
                <InternalLink to={`/beta/logs/${log.id}/history`}>(edited)</InternalLink>
            </>
        )
    }

    return (
        <FormattedDate date={log.createdDate} component="span" />
    )

}

const LogHeader = styled(({log, className}) => {

    return (
        <Stack 
            gap={1}
            className={className}
            padding={2}
        >
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
                <Typography variant="button" component="h3" >Log Information</Typography>
                <LogDetailActionButton log={log} />
            </Stack>
            <MetadataTable data={{
                "Author": log.owner,
                "Created": <CreatedDate log={log} />,
                "Logbooks": log?.logbooks.map(it => it.name).join(", "),
                "Tags": log?.tags.map(it => it.name).join(", "),
                "Entry Type": log.level
            }} />
            <Typography fontWeight="bold" >Attachments</Typography>
            { log.attachments && log.attachments.length > 0 
                ? <AttachmentsGallery attachments={log?.attachments?.map(it => new OlogAttachment({attachment: it})) ?? []} />
                : <Typography fontStyle="italic" >(None)</Typography>
            }
        </Stack>
    );
})(({theme}) => ({
    backgroundColor: `${theme.palette.primary.main}10`,
    borderLeft: `${theme.palette.primary.main} solid 5px`
}))

export default LogHeader;