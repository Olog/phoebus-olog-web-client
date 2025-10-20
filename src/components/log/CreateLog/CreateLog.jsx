import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { Backdrop, CircularProgress } from "@mui/material";
import { EntryEditor } from "../EntryEditor";
import { ologApi } from "api/ologApi";
import { useCustomSnackbar } from "src/hooks/useCustomSnackbar";

const CreateLog = () => {
  const [createInProgress, setCreateInProgress] = useState(false);
  const [createLog] = ologApi.endpoints.createLog.useMutation();
  const { data: levels } = ologApi.endpoints.getLevels.useQuery();
  const defaultLevel = levels?.find((level) => level?.defaultLevel);
  const { enqueueSnackbar } = useCustomSnackbar();

  const form = useForm({
    defaultValues: {
      attachments: []
    },
    values: {
      level: defaultLevel
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
    setCreateInProgress(true);

    const body = {
      logbooks: formData.logbooks,
      tags: formData.tags,
      properties: formData.properties,
      title: formData.title || "",
      level: formData.level?.name,
      description: formData.description || "",
      attachments: formData.attachments || []
    };

    createLog({ log: body })
      .unwrap()
      .then((data) => {
        clearFormData();
        setCreateInProgress(false);
        navigate(`/logs/${data.id}`);
      })
      .catch((error) => {
        setCreateInProgress(false);
        enqueueSnackbar("Failed to create log entry. Please try again later.", {
          severity: "error"
        });
        console.error("Failed to create log entry.", error);
        return error;
      });
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
          title: "New log entry",
          onSubmit
        }}
      />
    </>
  );
};
export default CreateLog;
