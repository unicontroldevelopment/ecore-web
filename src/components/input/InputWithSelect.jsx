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
  const [inputValue, setInputValue] = React.useState(""); // Estado para o valor do input
  const [unit, setUnit] = React.useState("kg"); // Estado para o valor do select

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Atualiza o estado do input
    onChange(e.target.value, unit); // Passa o valor atualizado do input e do select para o onChange
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value); // Atualiza o estado do select
    onChange(inputValue, e.target.value); // Passa o valor atualizado do input e do select para o onChange
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
              value={unit} // Define o valor do select
              onChange={handleUnitChange} // Captura a mudança do select
              sx={{
                width: 100,
                backgroundColor: "#e0e0e0", // Cor de fundo do seletor
                "& .MuiSelect-select": {
                  padding: "8px 14px", // Ajuste do padding
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
      onChange={handleInputChange} // Captura a mudança do input
      value={inputValue} // Usa o estado do input
      disabled={disabled}
    />
  );
}