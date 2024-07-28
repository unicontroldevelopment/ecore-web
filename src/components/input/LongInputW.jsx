/* eslint-disable react/prop-types */
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, TextField } from "@mui/material";

export function LongInput({ label, onDelete, onChange, value }) {

  return (
    <div style={{ width: "100%", marginBottom: "20px"}}>
      <TextField
        sx={{
          width: "94%",
          minHeight: 64,
        }}
        label={label}
        value={value}
        multiline
        onChange={onChange}
        fullWidth
      />
            <Button style={{ width: "1%"}} onClick={onDelete}>
        <DeleteIcon />
      </Button>
    </div>
  );
}
