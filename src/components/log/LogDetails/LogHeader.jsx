import { useRef, useState } from "react";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import EditIcon from "@mui/icons-material/Edit";
import LogDetailActionButton from "./LogDetailActionButton";
import { FormattedDate } from "src/components/shared/FormattedDate";

const LogHeader = ({ log, expanded, className }) => {
  const [copyUrlLabel, setCopyUrlLabel] = useState("Copy URL");
  const timeoutRef = useRef(null);

  const handleCopyUrl = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    navigator.clipboard.writeText(`${window.location.origin}/logs/${log.id}`);
    setCopyUrlLabel("URL Copied!");
    timeoutRef.current = setTimeout(() => {
      setCopyUrlLabel("Copy URL");
      timeoutRef.current = null;
    }, 5000);
  };
  return (
    <Stack
      flexDirection="column"
      alignItems="center"
      className={className}
      width="100%"
      py={1}
      px={3}
    >
      <Stack
        flexDirection="row"
        justifyContent={"space-between"}
        width={"100%"}
        height={"100%"}
      >
        <Stack>
          <Stack
            direction="row"
            alignItems="center"
            height={"20px"}
          >
            <Typography
              fontSize=".850rem"
              noWrap
              onClick={expanded ? (e) => e.stopPropagation() : undefined}
              sx={{ cursor: "auto" }}
            >
              @{log.owner}
            </Typography>
            <Typography
              sx={{
                ml: 1,
                backgroundColor: "#dfdfdf",
                padding: "2px 4px",
                borderRadius: "4px",
                fontSize: ".7rem",
                cursor: "auto"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              #{log.id}
            </Typography>
            {expanded && (
              <Tooltip title={copyUrlLabel}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl();
                  }}
                  sx={{ ml: 0.5, p: "4px" }}
                >
                  <ContentCopyOutlined
                    sx={{
                      color: "primary.main",
                      width: ".85rem",
                      height: ".85rem",
                      margin: "0 !important"
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          <Typography
            sx={{
              fontSize: ".975rem",
              fontWeight: 500,
              cursor: "auto"
            }}
            mt={0.8}
            onClick={expanded ? (e) => e.stopPropagation() : undefined}
          >
            {log.title}
          </Typography>
        </Stack>

        <Stack
          minWidth="130px"
          alignItems="flex-end"
        >
          <FormattedDate
            date={log.createdDate}
            sx={{ fontSize: ".775rem", cursor: "select" }}
          />

          {expanded && <LogDetailActionButton log={log} />}
          {!expanded && (
            <Stack
              direction="row"
              height="100%"
              alignItems="center"
              justifyContent={"flex-end"}
              mr={1}
              sx={{ "& > svg": { color: "#616161", opacity: 0.8 } }}
            >
              {log?.modifyDate && (
                <EditIcon
                  sx={{
                    cursor: "default",
                    fontSize: ".9rem"
                  }}
                />
              )}
              {log?.attachments?.length > 0 && (
                <AttachFileIcon
                  fontSize="small"
                  sx={{
                    cursor: "default",
                    fontSize: "1rem"
                  }}
                />
              )}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default LogHeader;
