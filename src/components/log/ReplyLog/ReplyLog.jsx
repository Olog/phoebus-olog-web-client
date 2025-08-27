import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Backdrop, CircularProgress } from "@mui/material";
import { EntryEditor } from "../EntryEditor";
import { ologApi } from "api/ologApi";
import { useCustomSnackbar } from "src/hooks/useCustomSnackbar";

const ReplyLog = ({ log }) => {
  const [replyInProgress, setReplyInProgress] = useState(false);
  const [replyLog] = ologApi.endpoints.createLog.useMutation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useCustomSnackbar();

  const form = useForm({
    defaultValues: {
      attachments: []
    },
    values: {
      attachments: [],
      logbooks: log?.logbooks ?? [],
      tags: log?.tags ?? [],
      level: { name: log?.level, defaultLevel: false },
      title: log?.title
    }
  });

  const onSubmit = async (formData) => {
    setReplyInProgress(true);
    const body = {
      logbooks: formData.logbooks,
      tags: formData.tags,
      properties: formData.properties,
      title: formData.title,
      level: formData.level?.name,
      description: formData.description,
      attachments: formData.attachments ?? []
    };
    replyLog({ log: body, replyTo: log.id })
      .unwrap()
      .then((data) => {
        setReplyInProgress(false);
        navigate(`/logs/${data.id}`);
      })
      .catch((error) => {
        setReplyInProgress(false);
        enqueueSnackbar(
          "Failed to reply to log entry. Please try again later.",
          {
            severity: "error"
          }
        );
        console.error("Failed to reply to log entry.", error);
        return error;
      });
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={replyInProgress}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <EntryEditor
        {...{
          form,
          title: `Reply to Log "${log?.title}"`,
          onSubmit
        }}
      />
    </>
  );
};
export default ReplyLog;
