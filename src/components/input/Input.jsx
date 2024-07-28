/* eslint-disable react/prop-types */
import TextField from "@mui/material/TextField";
import * as React from "react";

export function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  errorText,
  disabled,
}) {
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (errorText) {
      setError(true);
    } else {
      setError(false);
    }
  }, [errorText]);

  return (
      <TextField
        sx={{
          width: "100%",
          minHeight: 64,
        }}
        label={label}
        variant="outlined"
        type={type}
        name={name}
        autoComplete="on"
        size="small"
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        error={error}
        helperText={errorText}
        disabled={disabled}
      />
  );
}
