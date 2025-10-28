import { useRef, useState } from "react";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import EditIcon from "@mui/icons-material/Edit";
import LogDetailActionButton from "./LogDetailActionButton";
import { FormattedDate } from "src/components/shared/FormattedDate";
import { InternalLink } from "src/components/shared/Link";
import { useUser } from "src/features/authSlice";

const LogHeader = ({ log, expanded, className }) => {
  const [copyUrlLabel, setCopyUrlLabel] = useState("Copy URL");
  const timeoutRef = useRef(null);
  const user = useUser();

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

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const cursorStyle = expanded ? "auto" : "pointer";

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
            height="22px"
          >
            <Typography
              fontSize=".85rem"
              noWrap
              onClick={expanded ? stopPropagation : undefined}
              sx={{ cursor: cursorStyle }}
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
                cursor: cursorStyle
              }}
              onClick={expanded ? stopPropagation : undefined}
            >
              #{log.id}
            </Typography>
            {expanded && (
              <Tooltip title={copyUrlLabel}>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={
                    expanded
                      ? (e) => {
                          e.stopPropagation();
                          handleCopyUrl();
                        }
                      : undefined
                  }
                  sx={{
                    ml: 0.8,
                    p: "4px"
                  }}
                >
                  <ContentCopyOutlined
                    sx={{
                      width: ".9rem",
                      height: ".9rem"
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
              cursor: cursorStyle
            }}
            mt={0.8}
            onClick={expanded ? stopPropagation : undefined}
          >
            {log.title}
          </Typography>
        </Stack>

        <Stack
          minWidth="130px"
          alignItems="flex-end"
        >
          <Stack
            flexDirection="row"
            mr={1.5}
          >
            {user && expanded && log?.modifyDate && (
              <InternalLink
                to={`/logs/${log.id}/history`}
                sx={{
                  fontSize: ".75rem",
                  fontStyle: "italic",
                  fontWeight: 500,
                  lineHeight: "1.2rem"
                }}
                mr={1.5}
              >
                Edited
              </InternalLink>
            )}
            <FormattedDate
              date={log.createdDate}
              expanded={expanded}
              sx={{
                fontSize: ".8rem",
                cursor: cursorStyle
              }}
            />
          </Stack>

          {expanded && <LogDetailActionButton log={log} />}
          {!expanded && (
            <Stack
              direction="row"
              height="100%"
              alignItems="center"
              justifyContent={"flex-end"}
              mr={1}
              sx={{
                "& > svg": {
                  color: "#616161",
                  opacity: 0.8,
                  cursor: cursorStyle
                }
              }}
              onClick={expanded ? stopPropagation : undefined}
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
