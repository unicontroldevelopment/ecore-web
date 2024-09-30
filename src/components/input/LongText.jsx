import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";

export function LongText({
  label,
  isExpanded,
  onExpandToggle,
  onDelete,
  onChange,
  value,
}) {
  const calculateRows = (text) => {
    if (!isExpanded) return 1;
    const lines = (text.match(/\n/g) || []).length + 2;
    return Math.min(lines, 15);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        marginBottom: "20px",
      }}
    >
      <TextField
        sx={{
          flexGrow: 1,
          minHeight: 64,
        }}
        label={label}
        rows={calculateRows(value)}
        value={value}
        multiline
        onChange={onChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onExpandToggle} size="small">
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button onClick={onDelete} style={{ marginLeft: "8px" }}>
        <DeleteIcon />
      </Button>
    </div>
  );
}
