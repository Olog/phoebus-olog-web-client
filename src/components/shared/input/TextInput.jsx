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
        {...field}
        {...props}
      />
    );
  }
)({});

export default TextInput;
