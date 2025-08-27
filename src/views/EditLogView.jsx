import { useParams } from "react-router-dom";
import { EditLog } from "components/log/EditLog";
import LogContainer from "components/log/LogContainer";

const EditLogView = () => {
  const { id } = useParams();

  return (
    <LogContainer
      id={id}
      renderLog={({ log }) => <EditLog {...{ log }} />}
    />
  );
};
export default EditLogView;
