import { LogHistoryContainer } from "components/log/LogHistory";
import React from "react";
import { useParams } from "react-router-dom";

const LogHistoryView = () => {

    const { id } = useParams();
   
    return (
        <LogHistoryContainer {...{id}} />
    );
}
export default LogHistoryView;