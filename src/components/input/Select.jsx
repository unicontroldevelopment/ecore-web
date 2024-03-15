/* eslint-disable react/prop-types */
import * as React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export function CustomSelect({
  label,
  name,
  value,
  onChange,
  errorText,
  options,
}) {
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (errorText) {
      setError(true);
    } else {
      setError(false);
    }
  }, [errorText]);

  const upperCaseString = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <FormControl
      sx={{
        width: "100%",
        minHeight: 64,
      }}
      size="small"
      fullWidth
      error={error}
    >
      <InputLabel>{label}</InputLabel>
      <Select name={name} value={value} onChange={onChange} label={label}>
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {upperCaseString(option)}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
}
