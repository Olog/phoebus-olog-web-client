import React, { useState } from "react";
import { useForm } from "react-hook-form";
import EntryEditor from "../EntryEditor";
import customization from "config/customization";
import { ologClientInfoHeader } from "api/ologApi";
import ologAxiosApi, { ologAxiosApiWithRetry } from "api/axios-olog-service";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "components/shared/LoadingOverlay";

const ReplyLog = ({log, isAuthenticated}) => {

    const [replyInProgress, setReplyInProgress] = useState(false);
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

    const onSubmit = (formData) => {

        if(!formData || !isAuthenticated){
            setReplyInProgress(false);
            return;
        }

        setReplyInProgress(true);
        const logEntry = {
            logbooks: formData.logbooks,
            tags: formData.tags,
            properties: formData.properties,
            title: formData.title,
            level: formData.level,
            description: formData.description,
            attachments: formData.attachments
        }
        // This FormData object will contain both the log entry and all attached files, if any
        let multipartFormData = new FormData();
        // Append all files. Each is added with name "files", and that is actually OK
        for (let i = 0; i < formData.attachments.length; i++) {
            multipartFormData.append("files", formData.attachments[i].file, formData.attachments[i].file.name);
        }
        // Log entry must be added as JSON blob, otherwise the content type cannot be set.
        multipartFormData.append("logEntry", new Blob([JSON.stringify(logEntry)], {type: 'application/json'}));

        // Need to set content type for the request "multipart/form-data"
        let requestHeaders = ologClientInfoHeader();
        requestHeaders["Content-Type"] = "multipart/form-data";
        requestHeaders["Accept"] = "application/json";
        
        let url = `/logs/multipart?markup=commonmark&inReplyTo=${log.id}`
        // Upload the full monty, i.e. log entry and all attachment files, in one single request.
        ologAxiosApi.put(url, multipartFormData, { withCredentials: true, headers: requestHeaders})
            .then(async res => {
                // Wait until the new log entry is available in the search results
                await ologAxiosApiWithRetry({
                    method: 'GET',
                    path: `/logs/search?title=${res.data.title}&end=now`,
                    retries: 5,
                    retryCondition: (retryRes) => {
                        // Retry if the entry we created isn't in the search results yet
                        // Or if it does show in search but the attachments haven't been associated to it yet
                        // (the server sometimes responds with the entry but has an empty attachments field)
                        const found = retryRes?.data?.logs.find(it => `${it.id}` === `${res.data.id}`);
                        const hasAllAttachments = found?.attachments?.length === formData.attachments.length;
                        const willRetry = !found || (found && !hasAllAttachments)
                        return willRetry;
                    },
                    retryDelay: (count) => count*200
                });
                setReplyInProgress(false);
                navigate('/');
            })
            .catch(error => {
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
            });

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