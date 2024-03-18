/* eslint-disable react/prop-types */
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";

const { Title } = Typography;

export const Root = ({ children, title, handleSubmit, handleCancel }) => {
  return (
    <>
      <Title level={2}>{title}</Title>
      {children}
      <Row gutter={[12, 12]}>
        <Col>
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ backgroundColor: "#22BB33" }}
          >
            <CheckOutlined />
            Cadastrar
          </Button>
        </Col>
        <Col>
          <Button type="primary" danger onClick={handleCancel}>
            <CloseOutlined />
            Cancelar
          </Button>
        </Col>
      </Row>
    </>
  );
};
