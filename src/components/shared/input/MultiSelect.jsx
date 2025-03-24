/**
 * Copyright (C) 2019 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
import { useController } from "react-hook-form";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  styled
} from "@mui/material";

const MultiSelect = styled(
  ({
    name,
    label,
    control,
    rules,
    className,
    options = [],
    onChange,
    getOptionLabel,
    isOptionEqualToValue,
    isMulti,
    ...props
  }) => {
    const { field, fieldState } = useController({
      name,
      control,
      rules,
      defaultValue: isMulti ? [] : null
    });

    return (
      <Autocomplete
        className={className}
        {...field}
        id={field.name}
        value={field.value}
        onChange={
          onChange
            ? (e, value) => onChange(field, value)
            : (e, value) => field.onChange(value)
        }
        options={options}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={Boolean(fieldState?.error)}
            helperText={
              fieldState.error ? `Error: ${fieldState?.error?.message}` : null
            }
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {props?.loading ? (
                    <CircularProgress
                      color="inherit"
                      size={20}
                    />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              )
            }}
          />
        )}
        multiple={isMulti}
        filterSelectedOptions={isMulti}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        disablePortal
        sx={{ "& .MuiAutocomplete-tag": { fontSize: ".9rem", height: "30px" } }}
        {...props}
      />
    );
  }
)({});

export default MultiSelect;
