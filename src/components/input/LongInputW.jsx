/* eslint-disable react/prop-types */
import { TextField } from "@mui/material";

export function LongInput({ label, type = "text", name ,value, onChange, rows = 4 }) {

  return (
      <TextField
      sx={{
        width: "100%",
        minHeight: 64,
        marginBottom: "80px"
      }}
        label={label}
        type={type}
        name={name}
        value={value}
        size="large"
        onChange={onChange}
        multiline
        fullWidth
        rows={rows}
      />
  );
}
