import { useParams } from "react-router-dom";
import { LogHistoryContainer } from "components/log/LogHistory";

const LogHistoryView = () => {
  const { id } = useParams();

  return <LogHistoryContainer {...{ id }} />;
};
export default LogHistoryView;
