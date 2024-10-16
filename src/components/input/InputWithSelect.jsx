import { InputAdornment, MenuItem } from "@mui/material";
import TextField from "@mui/material/TextField";
import * as React from "react";

export function InputSelect({
  label,
  type = "text",
  name,
  value,
  onChange,
  disabled,
}) {
  const [inputValue, setInputValue] = React.useState("");
  const [unit, setUnit] = React.useState("kg");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onChange(e.target.value, unit);
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value); 
    onChange(inputValue, e.target.value);
  };

  return (
    <TextField
      sx={{
        width: "100%",
        minHeight: 64,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <TextField
              select
              variant="outlined"
              name="unitMedida"
              value={unit}
              onChange={handleUnitChange}
              sx={{
                width: 100,
                backgroundColor: "#e0e0e0",
                "& .MuiSelect-select": {
                  padding: "8px 14px",
                },
              }}
            >
              <MenuItem value="kg">kg</MenuItem>
              <MenuItem value="g">g</MenuItem>
              <MenuItem value="mg">mg</MenuItem>
              <MenuItem value="unit">unidade</MenuItem>
              <MenuItem value="l">l</MenuItem>
              <MenuItem value="ml">ml</MenuItem>
            </TextField>
          </InputAdornment>
        ),
      }}
      label={label}
      variant="outlined"
      type={type}
      name={name}
      autoComplete="on"
      size="small"
      onChange={handleInputChange}
      value={inputValue} 
      disabled={disabled}
    />
  );
}