import { useController } from "react-hook-form";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  styled
} from "@mui/material";

/**
 * Input that allows an user to select only one of several options available
 *
 * @param {string} name - Unique name/id of the field
 * @param {string} label - Label for the entire radio button group
 * @param {object[]} options - Options available for selection
 * @param {string} options[].label - Label displayed for the option
 * @param {object} options[].value - Value of the option
 * @param {object} control - react-hook-form control
 * @param {object} rules - react-hook-form rules
 * @param {object} defaultValue - default value selected
 * @param {function} onChange - callback invoked when input is changed, provides field and value
 */
const RadioInput = styled(
  ({
    name,
    label,
    options,
    control,
    rules,
    defaultValue,
    onChange,
    className
  }) => {
    const { field, fieldState } = useController({
      name,
      control,
      rules,
      defaultValue
    });

    const handleOnChange = (event) => {
      const val = event.target.value;
      field.onChange(val);
      if (onChange) {
        onChange(field, val);
      }
    };

    const error = fieldState.error
      ? `Error: ${fieldState?.error?.message}`
      : null;

    return (
      <FormControl
        id={name}
        sx={{
          border: "1px solid #ccc",
          borderRadius: 1,
          paddingX: 0.5,
          marginY: 0.5
        }}
        error={Boolean(error)}
        variant="standard"
        className={className}
      >
        <FormLabel
          sx={{
            display: "inline-block",
            position: "absolute",
            top: -10,
            left: 0,
            paddingX: "5px",
            marginX: "5px",
            fontSize: "0.75rem",
            backgroundColor: "#fff"
          }}
        >
          {label}
        </FormLabel>
        <RadioGroup
          aria-labelledby={name}
          {...field}
          onChange={handleOnChange}
          sx={{
            padding: 1
          }}
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.label}
              value={option.value}
              control={<Radio size="small" />}
              label={option.label}
            />
          ))}
          {error ? <FormHelperText>{error}</FormHelperText> : null}
        </RadioGroup>
      </FormControl>
    );
  }
)({});

export default RadioInput;
