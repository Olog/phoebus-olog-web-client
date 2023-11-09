import React from "react";
import { useForm } from "react-hook-form";
import EntryEditor from "../EntryEditor";

const EditLog = ({log}) => {

    const form = useForm({
        defaultValues: {
            attachments: []
        }
    });

    const onSubmit = (data) => {
        console.log({data})
    }

    const submitDisabled = false;

    return (
        <EntryEditor {...{form, title: `Edit Log "${log?.title}" (id ${log?.id})`, onSubmit, submitDisabled}} />
    )

}
export default EditLog;