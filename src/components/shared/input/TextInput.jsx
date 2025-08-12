import { useController } from "react-hook-form";
import { TextField, styled } from "@mui/material";

export const TextInput = styled(
  ({ name, label, control, rules, defaultValue, inputRef, ...props }) => {
    const {
      field: { ...field },
      fieldState
    } = useController({ name, control, rules, defaultValue });

    return (
      <TextField
        id={name}
        label={label}
        helperText={fieldState?.error?.message}
        error={Boolean(fieldState?.error)}
        inputRef={(e) => {
          field.ref(e);
          if (inputRef) {
            inputRef.current = e;
          }
        }}
        sx={{
          "& .MuiFormLabel-root": {
            fontSize: ".9rem",
            top: "-4px"
          },
          "& .MuiInputLabel-shrink": { top: 0 },
          "& .MuiInputBase-input": { padding: "12.5px 15px", fontSize: ".9rem" }
        }}
        {...field}
        {...props}
      />
    );
  }
)({});

export default TextInput;
