import { IconButton, Stack, Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import ReplyIcon from "@mui/icons-material/Reply";
import { ContextMenu } from "./ContextMenu";
import { useUser } from "features/authSlice";

const LogDetailActionButton = ({ log }) => {
  const user = useUser();

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      onClick={(e) => e.stopPropagation()}
    >
      {user && (
        <IconButton
          component={Link}
          to={`/logs/${log.id}/reply`}
          size="small"
          color="primary"
        >
          <Tooltip title="Reply">
            <ReplyIcon sx={{ p: "2.5px" }} />
          </Tooltip>
        </IconButton>
      )}
      {user && <ContextMenu log={log} />}
    </Stack>
  );
};

export default LogDetailActionButton;
