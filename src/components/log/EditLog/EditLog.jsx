import { useState } from "react";
import { useForm } from "react-hook-form";
import { Backdrop, CircularProgress } from "@mui/material";
import { EntryEditor } from "../EntryEditor";
import { ologApi, useVerifyLogExists } from "api/ologApi";
import useBetaNavigate from "hooks/useBetaNavigate";

const EditLog = ({ log, isAuthenticated }) => {
  const [editInProgress, setEditInProgress] = useState(false);
  const [editLog] = ologApi.endpoints.editLog.useMutation();
  const verifyLogExists = useVerifyLogExists();
  const navigate = useBetaNavigate();

  const existingLogGroup = log?.properties
    ?.filter((it) => it.name === "Log Entry Group")
    ?.at(0)?.value;

  const form = useForm({
    defaultValues: {
      attachments: []
    },
    values: { ...log, description: log.source }
  });

  const onSubmit = async (formData) => {
    if (!formData || !isAuthenticated) {
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
    };

    // Verify the group id hasn't been somehow edited
    // This shouldn't happen, but we should try to protect against it
    // since the backend currently does not protect against mangling the group id property
    const currentGroupId = body?.properties
      ?.filter((it) => it.name === "Log Entry Group")
      ?.at(0)?.value;
    if (currentGroupId !== existingLogGroup) {
      console.error("Log group has been edited!", body);
      return;
    }

    try {
      // Edit the log
      const data = await editLog({ log: body }).unwrap();
      try {
        // Verify full edited/available
        await verifyLogExists({ logRequest: formData, logResult: data });
        setEditInProgress(false);
      } catch (error) {
        console.error("An error occured while checking log was edited", error);
      } finally {
        navigate(`/logs/${data.id}`);
      }
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        alert("You are currently not authorized to edit a log entry.");
      } else if (error.response && error.response.status === 413) {
        // 413 = payload too large
        alert(error.response.data); // Message set in data by server
      } else if (error.response && error.response.status >= 500) {
        alert("Failed to edit log entry.");
      }
      setEditInProgress(false);
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={editInProgress}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <EntryEditor
        {...{
          form,
          title: `Edit Log "${log?.title}" (id ${log?.id})`,
          onSubmit,
          submitDisabled: !isAuthenticated,
          attachmentsDisabled: true
        }}
      />
    </>
  );
};
export default EditLog;
