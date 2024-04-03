/* eslint-disable react/prop-types */
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

export function LongInput({ label, isExpanded, onExpandToggle}) {

  const adornmentStyle = {
    position: "absolute",
    right: 0,
    top: 25,
    marginRight: "0px",
  };

  return (
      <TextField
        sx={{
          width: "100%",
          minHeight: 64,
        }}
        label={label}
        rows={isExpanded ? 10 : 1}
        multiline
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" style={adornmentStyle}>
              <IconButton onClick={onExpandToggle}>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
  );
}
