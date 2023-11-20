import React, { useState } from "react";
import { useForm } from "react-hook-form";
import EntryEditor from "../EntryEditor";
import useFormPersist from "react-hook-form-persist";
import { useNavigate } from "react-router-dom";
import ologAxiosApi, { ologAxiosApiWithRetry } from "api/axios-olog-service";
import { ologClientInfoHeader } from "api/ologApi";
import LoadingOverlay from "components/shared/LoadingOverlay";

const CreateLog = ({ isAuthenticated }) => {
  const [createInProgress, setCreateInProgress] = useState(false);

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
  const { clear: clearFormData } = useFormPersist("entryEditorFormData", {
    watch,
    setValue,
    storage: window.localStorage,
    exclude: "attachments" // serializing files is unsupported due to security risks
  });

  const onSubmit = (formData) => {
    if (!formData || !isAuthenticated) {
      setCreateInProgress(false);
      return;
    }

    setCreateInProgress(true);
    const logEntry = {
      logbooks: formData.logbooks,
      tags: formData.tags,
      properties: formData.properties,
      title: formData.title,
      level: formData.level,
      description: formData.description,
      attachments: formData.attachments
    };
    // This FormData object will contain both the log entry and all attached files, if any
    let multipartFormData = new FormData();
    // Append all files. Each is added with name "files", and that is actually OK
    for (let i = 0; i < formData.attachments.length; i++) {
      multipartFormData.append(
        "files",
        formData.attachments[i].file,
        formData.attachments[i].file.name
      );
    }
    // Log entry must be added as JSON blob, otherwise the content type cannot be set.
    multipartFormData.append(
      "logEntry",
      new Blob([JSON.stringify(logEntry)], { type: "application/json" })
    );

    // Need to set content type for the request "multipart/form-data"
    let requestHeaders = ologClientInfoHeader();
    requestHeaders["Content-Type"] = "multipart/form-data";
    requestHeaders.Accept = "application/json";

    let url = "/logs/multipart?markup=commonmark";
    // Upload the full monty, i.e. log entry and all attachment files, in one single request.
    ologAxiosApi
      .put(url, multipartFormData, {
        withCredentials: true,
        headers: requestHeaders
      })
      .then(async (res) => {
        // Wait until the new log entry is available in the search results
        await ologAxiosApiWithRetry({
          method: "GET",
          path: `/logs/search?title=${res.data.title}&end=now`,
          retries: 5,
          retryCondition: (retryRes) => {
            // Retry if the entry we created isn't in the search results yet
            // Or if it does show in search but the attachments haven't been associated to it yet
            // (the server sometimes responds with the entry but has an empty attachments field)
            const found = retryRes?.data?.logs.find(
              (it) => `${it.id}` === `${res.data.id}`
            );
            const hasAllAttachments =
              found?.attachments?.length === formData.attachments.length;
            const willRetry = !found || (found && !hasAllAttachments);
            return willRetry;
          },
          retryDelay: (count) => count * 200
        });
        clearFormData();
        setCreateInProgress(false);
        navigate("/");
      })
      .catch((error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          alert("You are currently not authorized to create a log entry.");
        } else if (error.response && error.response.status === 413) {
          // 413 = payload too large
          alert(error.response.data); // Message set in data by server
        } else if (error.response && error.response.status >= 500) {
          alert("Failed to create log entry.");
        }
        setCreateInProgress(false);
      });
  };

  return (
    <LoadingOverlay active={createInProgress}>
      <EntryEditor
        {...{
          form,
          title: "Create New Log",
          onSubmit,
          submitDisabled: !isAuthenticated
        }}
      />
    </LoadingOverlay>
  );
};
export default CreateLog;
