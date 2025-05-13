import { ButtonGroup } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import HistoryIcon from "@mui/icons-material/History";
import CopyUrlButton from "./CopyUrlButton";
import { useUser } from "features/authSlice";
import { InternalButtonLink } from "components/shared/Link";

const LogDetailActionButton = ({ log }) => {
  const user = useUser();

  return (
    <ButtonGroup
      variant="outlined"
      onClick={(event) => event.stopPropagation()}
      sx={
        !user
          ? {
              "& > button": { borderRadius: "4px" }
            }
          : {
              height: "32px",
              "& > button,a": { borderRadius: "0px" },
              "& > :first-child": {
                borderRadius: "4px 0 0 4px",
                marginRight: "-1px"
              },
              "& > :last-child": { borderRadius: "0 4px 4px 0" }
            }
      }
    >
      {log.modifyDate && (
        <InternalButtonLink
          to={`/logs/${log.id}/history`}
          startIcon={
            <HistoryIcon sx={{ width: "17px", marginBottom: "2px" }} />
          }
          sx={{ borderRadiusRight: "100px", fontSize: ".85rem" }}
        >
          History
        </InternalButtonLink>
      )}
      <CopyUrlButton url={`${window.location.origin}/logs/${log.id}`} />
      {user && (
        <>
          <InternalButtonLink
            to={`/logs/${log.id}/reply`}
            startIcon={
              <ReplyIcon sx={{ width: "16px", marginBottom: "2px" }} />
            }
            sx={{ fontSize: ".85rem" }}
          >
            Reply
          </InternalButtonLink>
          <InternalButtonLink
            to={`/logs/${log.id}/edit`}
            startIcon={<EditIcon sx={{ width: "15px" }} />}
            sx={{ borderRadiusRight: "100px", fontSize: ".85rem" }}
          >
            Edit
          </InternalButtonLink>
        </>
      )}
    </ButtonGroup>
  );
};

export default LogDetailActionButton;
