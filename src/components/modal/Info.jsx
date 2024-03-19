/* eslint-disable react/prop-types */
import { Col, Row } from "antd";
import styled from "styled-components";

let greyBackground = false;

export const StyledRow = styled(Row)`
  background-color: ${(props) => (props.backcolor ? "#f0f0f0" : "#fff")};
  color: #1e1e1e;
  padding: 0.5rem 1.5rem;
  align-items: center;
`;

export function Info({ label, value }) {
  greyBackground = !greyBackground;
  return (
    <StyledRow backcolor={greyBackground}>
      <Col span={12} style={{ textAlign: "left" }}>
        {label}
      </Col>
      <Col span={12} style={{ textAlign: "right" }}>
        {value}
      </Col>
    </StyledRow>
  );
}
