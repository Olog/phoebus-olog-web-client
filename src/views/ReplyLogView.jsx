import { useParams } from "react-router-dom";
import { ReplyLog } from "components/log/ReplyLog";
import LogContainer from "components/log/LogContainer";

const ReplyLogView = () => {
  const { id } = useParams();

  return (
    <LogContainer
      id={id}
      renderLog={({ log }) => <ReplyLog {...{ log }} />}
    />
  );
};
export default ReplyLogView;
