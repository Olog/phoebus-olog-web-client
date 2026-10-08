import { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import Modal from "components/shared/Modal";
import { ologApi } from "api/ologApi";

const LoadTemplate = ({ form, levels }) => {
  const [open, setOpen] = useState(false);
  const {
    data: templates = [],
    isFetching,
    isError,
    refetch
  } = ologApi.endpoints.getTemplates.useQuery(undefined, { skip: !open });

  const loadTemplate = (template) => {
    const values = {
      title: template.title,
      description: template.source ?? template.description,
      logbooks: template.logbooks,
      tags: template.tags,
      properties: template.properties
    };
    if (template.level != null) {
      values.level = levels?.find((level) => level.name === template.level) || {
        name: template.level,
        defaultLevel: false
      };
    }
    Object.entries(values).forEach(([name, value]) => {
      if (value != null) {
        form.setValue(name, value, { shouldDirty: true, shouldValidate: true });
      }
    });
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FileOpenIcon />}
        sx={{ mt: 1 }}
        onClick={() => setOpen(true)}
      >
        Load template
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Load template"
        content={
          <Stack gap={1}>
            {isFetching && <CircularProgress aria-label="Loading templates" />}
            {!isFetching && isError && (
              <Alert
                severity="error"
                action={<Button onClick={refetch}>Retry</Button>}
              >
                Failed to load templates. Please try again.
              </Alert>
            )}
            {!isFetching && !isError && templates.length === 0 && (
              <Typography>No templates available.</Typography>
            )}
            {!isFetching &&
              !isError &&
              templates.map((template) => (
                <Paper
                  key={template.id}
                  component={Stack}
                  variant="outlined"
                  padding={1}
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>{template.name}</Typography>
                  <Button
                    variant="contained"
                    onClick={() => loadTemplate(template)}
                    aria-label={`Load ${template.name}`}
                  >
                    Load
                  </Button>
                </Paper>
              ))}
          </Stack>
        }
      />
    </>
  );
};

export default LoadTemplate;
