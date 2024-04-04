/* eslint-disable react/prop-types */
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";

export function LongInput({ label, isExpanded, onExpandToggle, onDelete, onChange, value }) {
  const adornmentStyle = {
    position: "absolute",
    right: 0,
    top: 25,
    marginRight: "0px",
  };

  const calculateRows = (text) => {
    if (!isExpanded) return 1;
    const lines = (text.match(/\n/g) || []).length + 1;
    return Math.min(lines, 15);
  };

  return (
    <div style={{ width: "100%", marginBottom: "20px"}}>
      <TextField
        sx={{
          width: "94%",
          minHeight: 64,
        }}
        label={label}
        rows={calculateRows(value)}
        minRows={1}
        maxRows={isExpanded ? 15 : 1}
        value={value}
        multiline
        onChange={onChange}
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
            <Button style={{ width: "1%"}} onClick={onDelete}>
        <DeleteIcon />
      </Button>
    </div>
  );
}
