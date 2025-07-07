import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { Backdrop, CircularProgress } from "@mui/material";
import { EntryEditor } from "../EntryEditor";
import { ologApi, useVerifyLogExists } from "api/ologApi";

const CreateLog = ({ isAuthenticated }) => {
  const [createInProgress, setCreateInProgress] = useState(false);
  const [createLog] = ologApi.endpoints.createLog.useMutation();
  const verifyLogExists = useVerifyLogExists();

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

  const onSubmit = async (formData) => {
    if (!formData || !isAuthenticated) {
      setCreateInProgress(false);
      return;
    }

    setCreateInProgress(true);
    const body = {
      logbooks: formData.logbooks,
      tags: formData.tags,
      properties: formData.properties,
      title: formData.title,
      level: formData.level?.name,
      description: formData.description,
      attachments: formData.attachments ?? []
    };
    try {
      // Create log
      const data = await createLog({ log: body }).unwrap();
      try {
        // Verify it is fully indexed/created before redirecting
        await verifyLogExists({ logRequest: formData, logResult: data });
        clearFormData();
        setCreateInProgress(false);
      } catch (error) {
        console.error("An error occured while checking log was created", error);
      } finally {
        navigate(`/logs/${data.id}`);
      }
    } catch (error) {
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
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={createInProgress}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <EntryEditor
        {...{
          form,
          title: "Create New Log",
          onSubmit,
          submitDisabled: !isAuthenticated
        }}
      />
    </>
  );
};
export default CreateLog;
