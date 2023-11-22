import React, { useState } from "react";
import { useForm } from "react-hook-form";
import EntryEditor from "../EntryEditor";
import customization from "config/customization";
import { useCreateLogMutation } from "api/ologApi";
import { verifyLogExists } from "api/axios-olog-service";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "components/shared/LoadingOverlay";

const ReplyLog = ({log, isAuthenticated}) => {

    const [replyInProgress, setReplyInProgress] = useState(false);
    const [createLog] = useCreateLogMutation();
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            attachments: []
        },
        values: {
            /**
             * If currentLogEntry is defined, use it as a "template", i.e. user is replying to a log entry.
             * Copy relevant fields to the state of this class EXCEPT FOR entryType/level.
             * May or may not exist in the template.
             */
            logbooks: log?.logbooks ?? [],
            tags: log?.tags ?? [],
            level: customization.defaultLevel,
            title: log?.title,
        }
    });

    const onSubmit = async (formData) => {

        if(!formData || !isAuthenticated){
            setReplyInProgress(false);
            return;
        }

        setReplyInProgress(true);
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
            // create (reply to) the log
            const data = await createLog({log: body, replyTo: log.id}).unwrap();
            try {
                // verify log fully created before redirecting
                await verifyLogExists({logRequest: formData, logResult: data});
                setReplyInProgress(false);
                navigate(`/logs/${data.id}`);
            } catch (error) {
                console.log("An error occured while checking log was created", error);
            }
        } catch (error) {
            if(error.response && (error.response.status === 401 || error.response.status === 403)){
                alert('You are currently not authorized to reply to a log entry.')
            }
            else if(error.response && error.response.status === 413){ // 413 = payload too large
                alert(error.response.data); // Message set in data by server
            }
            else if(error.response && (error.response.status >= 500)){
                alert('Failed to reply to log entry.')
            }
            setReplyInProgress(false);
        }
    }

    return (
        <LoadingOverlay
            active={replyInProgress}
        >
            <EntryEditor {...{form, title: `Reply to Log "${log?.title}" (id ${log?.id})`, onSubmit, submitDisabled: !isAuthenticated}} />
        </LoadingOverlay>
    );

}
export default ReplyLog;