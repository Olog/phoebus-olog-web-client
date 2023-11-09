import { checkSession } from "api/olog-service";
import CreateLog from "components/log/CreateLog";
import React, { useEffect } from "react";

const CreateLogView = ({setShowLogin}) => {

    /**
     * Show login if no session
     */
    useEffect(() => {
        const promise = checkSession();
        if(!promise){
            setShowLogin(true);
        }
        else{
            promise.then(data => {
                if(!data){
                    setShowLogin(true);
                }
            });
        }
    }, [setShowLogin])

    return (
        <CreateLog />
    );
}
export default CreateLogView;