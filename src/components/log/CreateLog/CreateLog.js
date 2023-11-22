import React, { useState } from "react";
import { useForm } from "react-hook-form";
import EntryEditor from "../EntryEditor";
import useFormPersist from "react-hook-form-persist";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "components/shared/LoadingOverlay";
import { useCreateLogMutation } from "api/ologApi";
import { verifyLogExists } from "api/axios-olog-service";

const CreateLog = ({isAuthenticated}) => {

    const [createInProgress, setCreateInProgress] = useState(false);
    const [createLog] = useCreateLogMutation();

    const form = useForm({
        defaultValues: {
            attachments: []
        }
    });
    const { watch, setValue } = form;
    const navigate = useNavigate();

    /**
     * Save/restore form data
     */
    const {clear: clearFormData } =  useFormPersist( 'entryEditorFormData', {
        watch,
        setValue,
        storage: window.localStorage,
        exclude: 'attachments', // serializing files is unsupported due to security risks
    });

    const onSubmit = async (formData) => {

        if(!formData || !isAuthenticated){
            setCreateInProgress(false);
            return;
        }

        setCreateInProgress(true);
        const body = {
            logbooks: formData.logbooks,
            tags: formData.tags,
            properties: formData.properties,
            title: formData.title,
            level: formData.level,
            description: formData.description,
            attachments: formData.attachments ?? []
        }
        try {
            // Create log
            const data = await createLog({log: body}).unwrap();
            try {
                // Verify it is fully indexed/created before redirecting
                await verifyLogExists({logRequest: formData, logResult: data});
                clearFormData();
                setCreateInProgress(false);
                navigate(`/logs/${data.id}`);
            } catch (error) {
                console.log("An error occured while checking log was created", error);
            }
        } catch (error) {
            if(error.response && (error.response.status === 401 || error.response.status === 403)){
                alert('You are currently not authorized to create a log entry.')
            }
            else if(error.response && error.response.status === 413){ // 413 = payload too large
                alert(error.response.data); // Message set in data by server
            }
            else if(error.response && (error.response.status >= 500)){
                alert('Failed to create log entry.')
            }
            setCreateInProgress(false);
        }

    }

    return (
        <LoadingOverlay
            active={createInProgress}
        >
            <EntryEditor {...{form, title: "Create New Log", onSubmit, submitDisabled: !isAuthenticated}} />
        </LoadingOverlay>
    );
}
export default CreateLog;