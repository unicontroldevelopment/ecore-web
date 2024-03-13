/* eslint-disable react/prop-types */
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
export function CustomSelect({
  label,
  name,
  value,
  onChange,
  errorText,
  options,
}) {

  const hasError = Boolean(errorText);
  const upperCaseString = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <FormControl size='small' fullWidth error={hasError}>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {upperCaseString(option)}
          </MenuItem>
        ))}
      </Select>
      {hasError && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
}
