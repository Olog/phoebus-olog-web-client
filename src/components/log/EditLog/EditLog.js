import React, { useState } from "react";
import { useForm } from "react-hook-form";
import EntryEditor from "../EntryEditor";
import { ologClientInfoHeader } from "api/ologApi";
import ologAxiosApi, { ologAxiosApiWithRetry } from "api/axios-olog-service";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "components/shared/LoadingOverlay";

const EditLog = ({log, isAuthenticated}) => {

    const navigate = useNavigate();
    const [editInProgress, setEditInProgress] = useState(false);

    const form = useForm({
        defaultValues: {
            attachments: []
        },
        values: {...log, entryType: log.level}
    });

    const onSubmit = (formData) => {

        if(!formData || !isAuthenticated){
            setEditInProgress(false);
            return;
        }

        setEditInProgress(true);

        let requestHeaders = ologClientInfoHeader();
        requestHeaders["Content-Type"] = "application/json";
        requestHeaders["Accept"] = "application/json";
        
        let url = `/logs/${log.id}?markup=commonmark`;
        // Upload the full monty, i.e. log entry and all attachment files, in one single request.
        ologAxiosApi.post(
            url, 
            {
                id: log.id,
                logbooks: formData.logbooks,
                tags: formData.tags,
                properties: formData.properties,
                title: formData.title,
                level: formData.entryType,
                description: formData.description
            },
            { withCredentials: true, headers: requestHeaders}
            )
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
                setEditInProgress(false);
                navigate('/');
            })
            .catch(error => {
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
            });

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