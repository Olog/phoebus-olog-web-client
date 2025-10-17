import { useParams } from "react-router-dom";
import { Alert, LinearProgress } from "@mui/material";
import { EditLog } from "components/log/EditLog";
import { ologApi } from "src/api/ologApi";

const EditLogView = () => {
  const { id } = useParams();
  const {
    data: log,
    isLoading,
    error
  } = ologApi.endpoints.getLog.useQuery(
    { id, noInvalidate: true },
    {
      skip: false
    }
  );

  if (isLoading) {
    return <LinearProgress sx={{ width: "100%" }} />;
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{ m: 2 }}
      >
        Error loading log entry {id}
      </Alert>
    );
  }

  return <EditLog log={log} />;
};

export default EditLogView;
