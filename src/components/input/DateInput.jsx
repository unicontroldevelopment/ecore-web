/* eslint-disable react/prop-types */
import { FormControl } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export function DateInput({ label, name, value, onChange }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const dateInputId = `date-picker-${label.replace(/\s+/g, "-").toLowerCase()}`;

  useEffect(() => {
    if (value) {
      setSelectedDate(dayjs(value));
    }
  }, [value]);

  const handleTextChange = (e) => {
    const inputValue = e.target.value;

    if (/^\d{8}$/.test(inputValue)) {
      const day = inputValue.slice(0, 2);
      const month = inputValue.slice(2, 4);
      const year = inputValue.slice(4, 8);
      const formattedDate = `${day}/${month}/${year}`;

      const newDate = dayjs(formattedDate, "DD/MM/YYYY");
      setSelectedDate(newDate);
      onChange(newDate, formattedDate);
    }
  };

  const handleChange = (date) => {
    const formattedDate = date ? date.format("DD/MM/YYYY") : "";
    setSelectedDate(date);
    onChange(date, formattedDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl variant="outlined" fullWidth sx={{ width: "100%", minHeight: 64 }}>
        <DatePicker
          label={label}
          value={selectedDate}
          onChange={handleChange}
          inputFormat="DD/MM/YYYY"
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              id: dateInputId,
              name: name,
              variant: "outlined",
              fullWidth: true,
              size: "small",
              onBlur: handleTextChange,
              sx: {
                "& .MuiInputBase-root": {
                  height: 40,
                },
              },
            },
          }}
        />
      </FormControl>
    </LocalizationProvider>
  );
}