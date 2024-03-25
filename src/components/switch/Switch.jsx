/* eslint-disable react/prop-types */
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { InputLabel } from "@mui/material";
import { Switch } from "antd";
import { StyledSwitchContainer } from "./styles";

export function SwitchSelect({ onChange, label, enabled, permissionName }) {
  return (
    <StyledSwitchContainer style={{ marginBottom: "20px"}}>
      <InputLabel style={{ marginRight: "10px", lineHeight: "20px", fontWeight: "bold" }}>
        {label}
      </InputLabel>
      <Switch
        style={{ backgroundColor: enabled ? "#3CB371" : "#DC143C" }}
        checked={enabled}
        onChange={(checked) => onChange(checked, permissionName)}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        defaultChecked
      />
    </StyledSwitchContainer>
  );
}
