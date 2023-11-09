import ReplyLog from "components/log/ReplyLog";
import LogContainer from "components/log/LogContainer";
import React from "react";
import { useParams } from "react-router-dom";

const ReplyLogView = ({setShowLogin}) => {

    const { id } = useParams();

    return (
        <LogContainer id={id} setShowLogin={setShowLogin} renderLog={log => <ReplyLog log={log} />} />
    );
}
export default ReplyLogView;