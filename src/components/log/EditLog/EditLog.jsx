import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Backdrop, CircularProgress } from "@mui/material";
import { EntryEditor } from "../EntryEditor";
import { useOnPage } from "src/hooks/onPage";
import { ologApi } from "api/ologApi";
import { useWebSockets } from "src/hooks/useWebSockets";
import { useCustomSnackbar } from "src/hooks/useCustomSnackbar";

const EditLog = ({ log }) => {
  const navigate = useNavigate();
  const { updatedLogEntryId } = useWebSockets();
  const { enqueueSnackbar, closeSnackbar } = useCustomSnackbar();
  const { onEditPage } = useOnPage();

  const [editInProgress, setEditInProgress] = useState(false);
  const [editLog] = ologApi.endpoints.editLog.useMutation();

  useEffect(() => {
    setTimeout(() => {
      if (
        updatedLogEntryId &&
        Number(updatedLogEntryId) === log?.id &&
        onEditPage
      ) {
        closeSnackbar(log?.id);
        enqueueSnackbar(
          "This log entry has been updated. Please refresh the page.",
          {
            severity: "warning",
            autoHideDuration: null,
            id: log?.id
          }
        );
      }
    }, 1000);

    return () => {
      closeSnackbar(log?.id);
    };
  }, [closeSnackbar, enqueueSnackbar, log?.id, onEditPage, updatedLogEntryId]);

  const form = useForm({
    defaultValues: {
      attachments: []
    },
    values: {
      ...log,
      description: log.source,
      level: { name: log.level, defaultLevel: false }
    }
  });

  const onSubmit = async (formData) => {
    setEditInProgress(true);

    const body = {
      id: log.id,
      logbooks: formData.logbooks,
      tags: formData.tags,
      properties: formData.properties,
      title: formData.title,
      level: formData.level?.name,
      description: formData.description
    };

    editLog({ log: body })
      .unwrap()
      .then((data) => {
        setEditInProgress(false);
        navigate(`/logs/${data.id}`);
      })
      .catch((error) => {
        setEditInProgress(false);
        enqueueSnackbar("Failed to edit log entry. Please try again later.", {
          variant: "error"
        });
        console.error("Failed to edit log entry.", error);
        return error;
      });
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
          title: `Edit Log "${log?.title}"`,
          onSubmit,
          attachmentsDisabled: true
        }}
      />
    </>
  );
};
export default EditLog;
