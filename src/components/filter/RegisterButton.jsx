/* eslint-disable react/prop-types */
import { Button, Col } from "antd";

export const RegisterButton = ({ label, onClick }) => {
  return (
    <Col>
      <Button
        size="large"
        fullWidth
        sx={{
          width: "100%",
        }}
        onClick={onClick}
        style={{
          backgroundColor: "#4168b0",
          color: "white",
        }}
      >
        {label}
      </Button>
    </Col>
  );
};
