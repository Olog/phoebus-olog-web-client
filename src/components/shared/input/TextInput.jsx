import { useController } from "react-hook-form";
import { TextField, styled } from "@mui/material";

export const TextInput = styled(
  ({ name, label, control, rules, defaultValue, ...props }) => {
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
        inputRef={field.ref}
        sx={{
          "& .MuiFormLabel-root": {
            fontSize: ".9rem",
            top: "-4px"
          },
          "& .MuiInputLabel-shrink": { top: 0 },
          "& .MuiInputBase-input": { padding: "11.5px 12px", fontSize: ".9rem" }
        }}
        {...field}
        {...props}
      />
    );
  }
)({});

export default TextInput;
