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
      py={1.3}
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
            backgroundColor: "#ECF0F3",
          },
        }),
        ...(selected && {
          "&:hover": {
            cursor: "pointer",
          },
          borderRadius: "1px",
          backgroundColor: "#0099dc24",
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
            top: "30%",
            left: "55px",
            transform: "rotate(-90deg) translate(-50%, -50%)",
            color: "#6f6f6f",
          }}
          fontSize="small"
        />
      )}
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        pb="4px"
      >
        <Typography noWrap fontSize=".75rem" variant="body2">
          {log.owner}
        </Typography>

        <FormattedDate
          date={log.createdDate}
          whiteSpace="nowrap"
          variant="body2"
          fontSize=".75rem"
        />
      </Stack>
      <Stack
        maxHeight="22px"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Typography fontSize=".85rem" noWrap fontWeight="bold">
          {log.title}
        </Typography>
        <Box>
          {log?.attachments?.length > 0 ? (
            <AttachFileIcon
              fontSize="small"
              sx={{ fontSize: "1.2rem", marginRight: "-2px", marginTop: "4px" }}
            />
          ) : null}
        </Box>
      </Stack>

      <CommonMark
        commonmarkSrc={log.source}
        isSummary
        sx={{
          fontSize: ".9rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
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
