import React from "react";
import CreateLog from "components/log/CreateLog";
import useIsAuthenticated from "hooks/useIsAuthenticated";

const CreateLogView = () => {

    const [isAuthenticated] = useIsAuthenticated();
   
    return (
        <CreateLog {...{isAuthenticated}} />
    );
}
export default CreateLogView;