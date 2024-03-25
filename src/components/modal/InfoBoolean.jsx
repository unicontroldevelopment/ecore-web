/* eslint-disable react/prop-types */
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'; // Importando ícones do Ant Design
import { Col, Row } from "antd";
import styled from "styled-components";

let greyBackground = false;

export const StyledRow = styled(Row)`
  background-color: ${(props) => (props.backcolor ? "#f0f0f0" : "#fff")};
  color: #1e1e1e;
  padding: 0.5rem 1.5rem;
  align-items: center;
`;

export function InfoBoolean({ label, value}) {
  greyBackground = !greyBackground;


 const icon = value ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />;

  return (
    <StyledRow backcolor={greyBackground}>
      <Col span={12} style={{ textAlign: "left" }}>
        {label}
      </Col>
      <Col span={12} style={{ textAlign: "right" }}>
        {icon}
      </Col>
    </StyledRow>
  );
}