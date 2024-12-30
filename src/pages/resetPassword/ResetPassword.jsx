import TextField from "@mui/material/TextField";
import { Button, Col, Row } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Toast } from "../../components/toasts";
import EmployeeService from "../../services/EmployeeService";
import { Subtitle, Title } from "./styles";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background-color: #4168b0; /* Light blue background */
`;

const FormWrapper = styled.div`
  max-width: 400px;
  width: 100%;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const service = new EmployeeService();

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Toast.Error("Preencha todos os campos.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Toast.Error("As senhas não coincidem.");
      return;
    }

    try {
      const response = await service.resetPassword(token, newPassword);

      if (response.status === 200) {
        Toast.Success(
          "Senha alterada com sucesso. Redirecionando para a página de login."
        );
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        Toast.Error(response.response.data.message);
      }
    } catch (error) {
      Toast.Error("Falha ao redefinir senha. Tente novamente.");
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Row gutter={[16, 12]}>
          <Col span={24}>
            <Title>Redefinir Senha</Title>
            <Subtitle>Insira sua nova senha</Subtitle>
          </Col>
          <Col span={24}>
            <TextField
              sx={{
                width: "100%",
              }}
              label="Nova Senha"
              variant="outlined"
              type="password"
              size="small"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Col>
          <Col span={24}>
            <TextField
              sx={{
                width: "100%",
              }}
              label="Confirmar Senha"
              variant="outlined"
              type="password"
              size="small"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Col>
          <Col span={24}>
            <Button type="primary" onClick={handleResetPassword} block>
              Redefinir Senha
            </Button>
          </Col>
        </Row>
      </FormWrapper>
    </Container>
  );
};

export default ResetPassword;
