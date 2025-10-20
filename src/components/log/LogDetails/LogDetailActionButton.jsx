import { IconButton, Stack, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import CopyUrlButton from "./CopyUrlButton";
import { useUser } from "features/authSlice";

const LogDetailActionButton = ({ log }) => {
  const user = useUser();

  return (
    <Stack direction="row">
      {user && (
        <IconButton
          component={Link}
          to={`/logs/${log.id}/reply`}
          size="medium"
          sx={{ mb: "2px" }}
          color="primary"
        >
          <Tooltip title="Reply">
            <ReplyIcon sx={{ p: "3px" }} />
          </Tooltip>
        </IconButton>
      )}
      <CopyUrlButton url={`${window.location.origin}/logs/${log.id}`} />
      {user && (
        <>
          {log.modifyDate && (
            <IconButton
              size="medium"
              sx={{ mb: "2px" }}
              color="primary"
              component={Link}
              to={`/logs/${log.id}/history`}
            >
              <Tooltip title="History">
                <HistoryIcon sx={{ p: "3px" }} />
              </Tooltip>
            </IconButton>
          )}
          <IconButton
            size="medium"
            color="primary"
            component={Link}
            to={`/logs/${log.id}/edit`}
          >
            <Tooltip title="Edit">
              <EditIcon sx={{ p: "4.5px" }} />
            </Tooltip>
          </IconButton>
        </>
      )}
    </Stack>
  );
};

export default LogDetailActionButton;
