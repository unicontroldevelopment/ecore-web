/* eslint-disable react/prop-types */
import { Col } from "antd";
import { Container } from "./styles";

export function SwitchRoot({ children, columnSize = 8 }) {
  return (
    <Col span={columnSize}>
      <Container>{children}</Container>
    </Col>
  );
}