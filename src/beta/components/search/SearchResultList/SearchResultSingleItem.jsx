import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import FormattedDate from "components/shared/FormattedDate";
import TurnRightIcon from "@mui/icons-material/TurnRight";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { LogbookChip } from "beta/components/log/LogbookChip";
import { TagChip } from "beta/components/log/TagChip";
import CommonMark from "components/shared/CommonMark";

export const SearchResultSingleItem = ({
  log,
  selected,
  onClick,
  isReply,
  expandIcon,
  handleKeyDown,
}) => {
  return (
    <Stack
      px={4}
      py={1.5}
      sx={{
        position: "relative",
        borderBottom: "1px solid #bdbdbd",
        borderRadius: "1px",
        "&:focus": {
          outline: "none",
        },
        ...(!selected && {
          "&:hover": {
            cursor: "pointer",
            backgroundColor: "grey.200",
          },
        }),
        ...(selected && {
          "&:hover": {
            cursor: "pointer",
          },
          borderRadius: "1px",
          backgroundColor: "grey.300",
        }),
        ...(isReply && {
          paddingLeft: "75px",
        }),
        "&:last-child": {
          borderBottom: "none",
        },
      }}
      onClick={() => onClick(log)}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      data-id={log.id}
    >
      {isReply && (
        <TurnRightIcon
          sx={{
            position: "absolute",
            top: "35%",
            left: "55px",
            transform: "rotate(-90deg) translate(-50%, -50%)",
            color: "#6f6f6f",
          }}
          fontSize="small"
        />
      )}
      <Stack flexDirection="row" gap={1} paddingBottom={0.5}>
        <FormattedDate
          date={log.createdDate}
          whiteSpace="nowrap"
          variant="body2"
          fontSize=".75rem"
          fontWeight="bold"
          color="#0099db"
          sx={{ opacity: 0.8 }}
        />
        <Typography noWrap fontSize=".75rem" variant="body2">
          {log.owner}
        </Typography>
      </Stack>
      <Stack flexDirection="row" justifyContent="space-between">
        <Typography mb={0.5} noWrap variant="body1" fontWeight="bold">
          {log.title}
        </Typography>
        <Box>
          {log?.attachments?.length > 0 ? (
            <AttachFileIcon fontSize="small" />
          ) : null}
        </Box>
      </Stack>
      {console.log({ log: log.description })}

      <CommonMark
        commonmarkSrc={log.source}
        isSummary
        sx={{ fontSize: ".9rem" }}
      />

      {!isReply && (
        <Stack
          mt={1}
          flexDirection="row"
          gap={0.5}
          flexWrap="wrap"
          gridColumn="span 2"
          sx={{ "& > div": { cursor: "pointer" } }}
        >
          {log?.logbooks?.map((it) => (
            <LogbookChip
              sx={{ fontSize: ".7rem" }}
              key={it.name}
              value={it.name}
            />
          ))}
          {log?.tags?.map((it) => (
            <TagChip sx={{ fontSize: ".7rem" }} key={it.name} value={it.name} />
          ))}
        </Stack>
      )}
      {expandIcon}
    </Stack>
  );
};
