import {
  Autocomplete,
  FormControl,
  FormHelperText,
  TextField
} from "@mui/material";
import * as React from "react";

export function CustomSelect({
  label,
  name,
  value,
  onChange,
  errorText,
  multiple,
  options,
  noOptionsText,
}) {
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setError(!!errorText);
  }, [errorText]);

  const upperCaseString = (text) => {
    if (typeof text !== "string") {
      return String(text);
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleOnChange = (event, newValue) => {
    const simulatedEvent = {
      target: {
        name: name,
        value: multiple ? newValue : newValue || null
      }
    };
    onChange(simulatedEvent);
  };

  return (
    <FormControl
      fullWidth
      error={error}
    >
      <Autocomplete
      sx={{ width: "100%", minHeight: 64}}
        disablePortal
        fullWidth
        size="small"
        multiple={multiple}
        options={options}
        getOptionLabel={(option) => upperCaseString(option)}
        value={multiple ? (value || []) : (value || null)}
        onChange={handleOnChange}
        renderInput={(params) => (
          <TextField {...params} label={label} name={name}/>
        )}
        disableCloseOnSelect={multiple}
        noOptionsText={noOptionsText ? noOptionsText : "Sem opções"}
      />
      {error && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
}