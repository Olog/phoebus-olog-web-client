import EditLog from "components/log/EditLog";
import LogContainer from "components/log/LogContainer";
import useIsAuthenticated from "hooks/useIsAuthenticated";
import React from "react";
import { useParams } from "react-router-dom";

const EditLogView = () => {

    const { id } = useParams();
    const [isAuthenticated] = useIsAuthenticated();

    return (
        <LogContainer 
            id={id} 
            renderLog={({log}) => <EditLog {...{log, isAuthenticated}} />} 
        />
    );
}
export default EditLogView;