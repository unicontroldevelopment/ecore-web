import { Button, Modal } from "antd";
import { useState } from "react";
import { CustomInput } from "../input";

const D4SignEmailModal = ({ isVisible, onClose, onRegister, loading }) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleRegister = () => {
    onRegister(email);
    setEmail("");
  };

  return (
    <Modal
      title="Registrar Assinatura"
      open={isVisible}
      onCancel={onClose}
      centered
      width="45%"
      footer={[
        <Button key="back" onClick={onClose}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleRegister}
        >
          Registrar
        </Button>,
      ]}
    >
      <CustomInput.Input
        label="E-mail"
        type="text"
        name="email"
        value={email}
        onChange={handleEmailChange}
      />
    </Modal>
  );
};

export default D4SignEmailModal;
