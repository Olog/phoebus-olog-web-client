import EditIcon from "@mui/icons-material/Edit";
import { FormattedDate } from "components/shared/FormattedDate";
import { InternalLink } from "components/shared/Link";

export const CreatedDate = ({ log }) => {
  if (log.modifyDate) {
    return (
      <>
        <FormattedDate
          date={log.modifyDate}
          component="span"
        />{" "}
        <InternalLink to={`/beta/logs/${log.id}/history`}>
          <EditIcon
            fontSize="small"
            sx={{ verticalAlign: "text-top" }}
          />
          view history
        </InternalLink>
      </>
    );
  }

  return (
    <FormattedDate
      date={log.createdDate}
      component="span"
    />
  );
};
