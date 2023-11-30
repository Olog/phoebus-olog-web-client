import React, { useState } from "react";
import { useForm } from "react-hook-form";
import EntryEditor from "../EntryEditor";
import { ologApi, useVerifyLogExists } from "api/ologApi";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingOverlay from "components/shared/LoadingOverlay";

const EditLog = ({log, isAuthenticated}) => {

    const [editInProgress, setEditInProgress] = useState(false);
    const [editLog] = ologApi.endpoints.editLog.useMutation();
    const verifyLogExists = useVerifyLogExists();
    const navigate = useNavigate();
    const location = useLocation();

    const form = useForm({
        defaultValues: {
            attachments: []
        },
        values: {...log, description: log.source}
    });

    const onSubmit = async (formData) => {

        if(!formData || !isAuthenticated){
            setEditInProgress(false);
            return;
        }

        setEditInProgress(true);

        const body = {
            id: log.id,
            logbooks: formData.logbooks,
            tags: formData.tags,
            properties: formData.properties,
            title: formData.title,
            level: formData.level,
            description: formData.description
        }

        try {
            // Edit the log
            const data = await editLog({log: body}).unwrap();
            try {
                // Verify full edited/available
                await verifyLogExists({logRequest: formData, logResult: data});
                setEditInProgress(false);
                if(location.pathname.startsWith("/beta")) {
                    navigate(`/beta/logs/${data.id}`);
                } else {
                    navigate(`/logs/${data.id}`);
                }
            } catch (error) {
                console.error("An error occured while checking log was edited", error);
            }
        } catch (error) {
            if(error.response && (error.response.status === 401 || error.response.status === 403)){
                alert('You are currently not authorized to edit a log entry.')
            }
            else if(error.response && error.response.status === 413){ // 413 = payload too large
                alert(error.response.data); // Message set in data by server
            }
            else if(error.response && (error.response.status >= 500)){
                alert('Failed to edit log entry.')
            }
            setEditInProgress(false);
        }

    }

    return (
        <LoadingOverlay
            active={editInProgress}
        >
            <EntryEditor {...{
                form, 
                title: `Edit Log "${log?.title}" (id ${log?.id})`, 
                onSubmit, 
                submitDisabled: !isAuthenticated, 
                attachmentsDisabled: true
            }} />
        </LoadingOverlay>
    )

}
export default EditLog;