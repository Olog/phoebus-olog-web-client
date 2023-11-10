import React from "react";
import CreateLog from "components/log/CreateLog";
import useIsAuthenticated from "hooks/useIsAuthenticated";

const CreateLogView = ({setShowLogin}) => {

    const [isAuthenticated] = useIsAuthenticated({setShowLogin});
   
    return (
        <CreateLog {...{isAuthenticated}} />
    );
}
export default CreateLogView;