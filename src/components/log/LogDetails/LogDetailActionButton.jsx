import { Stack } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import CopyUrlButton from "./CopyUrlButton";
import { useUser } from "features/authSlice";
import { InternalButtonLink } from "components/shared/Link";

const LogDetailActionButton = ({ log }) => {
  const user = useUser();

  return (
    <Stack
      direction="row"
      spacing={1}
    >
      {user && (
        <InternalButtonLink
          to={`/logs/${log.id}/reply`}
          startIcon={<ReplyIcon sx={{ width: "14px", marginBottom: "2px" }} />}
          sx={{ fontSize: ".8rem" }}
        >
          Reply
        </InternalButtonLink>
      )}
      <CopyUrlButton url={`${window.location.origin}/logs/${log.id}`} />
      {log.modifyDate && (
        <InternalButtonLink
          to={`/logs/${log.id}/history`}
          startIcon={
            <HistoryIcon sx={{ width: "15px", marginBottom: "2px" }} />
          }
          sx={{ borderRadiusRight: "100px", fontSize: ".8rem" }}
        >
          History
        </InternalButtonLink>
      )}
      {user && (
        <InternalButtonLink
          to={`/logs/${log.id}/edit`}
          startIcon={<EditIcon sx={{ width: "13px" }} />}
          sx={{ borderRadiusRight: "100px", fontSize: ".8rem" }}
        >
          Edit
        </InternalButtonLink>
      )}
    </Stack>
  );
};

export default LogDetailActionButton;
