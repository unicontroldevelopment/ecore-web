/* eslint-disable react/prop-types */
import { FormControl, InputLabel } from "@mui/material";
import { DatePicker as AntDatePicker } from "antd";
import dayjs from "dayjs";
import styled from "styled-components";

const StyledDatePicker = styled(AntDatePicker)`
  &.ant-picker {
    width: 100%;
    .ant-picker-input {
      height: 48px;
    }
    input {
      height: 48px;
    }
  }
`;

export function DateInput({ label, name, value, onChange }) {
  const dateInputId = `date-picker-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const handleTextChange = (e) => {
    const inputValue = e.target.value;

    if (/^\d{8}$/.test(inputValue)) {
      const day = inputValue.slice(0, 2);
      const month = inputValue.slice(2, 4);
      const year = inputValue.slice(4, 8);
      const formattedDate = `${day}/${month}/${year}`;


      onChange(dayjs(formattedDate, "DD/MM/YYYY"), formattedDate);
    }
  };

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor={dateInputId}>{label}</InputLabel>
      <StyledDatePicker
        id={dateInputId}
        name={name}
        value={value ? dayjs(value) : null}
        onChange={(date, dateString) => onChange(date, dateString)}
        format="DD/MM/YYYY"
        style={{ marginTop: "16px", marginBottom: "43px", maxHeight: 43 }}
        onBlur={handleTextChange}
      />
    </FormControl>
  );
}
