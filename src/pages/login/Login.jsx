import * as React from "react";

import logo_slogan from "../../assets/logo_slogan.png";
import Loading from "../../components/animations/Loading";
import { AuthContext } from "../../contexts/Auth";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { Button, Col, Row } from "antd";

import { Toast } from "../../components/toasts";
import Utils from "../../services/Utils";
import { CenteredDiv, LeftDiv, RightDiv, Subtitle, Title } from "./styles";

const Login = () => {
  const { loginAuth, logoutAuth } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const service = new Utils();

  React.useEffect(() => {
    logoutAuth();
  }, []);

  const forgetPassword = async () => {
    if(!email){
      Toast.Error("Preencha o campo de e-mail, para solicitar a recuperação de senha.");
    } else {
      // Enviar email para recuperar senha
      const response = await service.forgotPassword(email);
      if(response.status === 200) {
        Toast.Info(response.data.message);
      }

    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await loginAuth(email, password);
    setLoading(false);
  };

  const handleClickShowPassword = () => {
    setIsVisible(!isVisible);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      {loading ? <Loading /> : null}
      <LeftDiv>
        <CenteredDiv>
          <Row gutter={[16, 12]}>
            <Col span={24}>
              <Title>Bem-vindo ao Ecore Web 2.0</Title>
              <Subtitle>Entre na sua conta</Subtitle>
            </Col>
            <Col span={24}>
              <TextField
                sx={{
                  width: "100%",
                }}
                label="E-mail"
                variant="outlined"
                type="email"
                name="email"
                autoComplete="on"
                size="small"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Col>
            <Col span={24}>
              <TextField
                sx={{
                  width: "100%",
                }}
                label="Senha"
                variant="outlined"
                type={isVisible ? "text" : "password"}
                name="password"
                autoComplete="on"
                size="small"
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {isVisible ? (
                          <VisibilityOff
                            sx={{
                              width: "20px",
                            }}
                          />
                        ) : (
                          <Visibility
                            sx={{
                              width: "20px",
                            }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Col>
            <Col span={24}>
              <Button
                type="link"
                onClick={forgetPassword}
                style={{
                  padding: 0,
                  height: "auto",
                  lineHeight: "normal",
                  color: "black",
                }}
              >
                Esqueceu a senha?
              </Button>
            </Col>
            <Col span={8}>
              <Button type="primary" onClick={handleSubmit}>
                Entrar
              </Button>
            </Col>
          </Row>
        </CenteredDiv>
      </LeftDiv>
      <RightDiv>
        <img src={logo_slogan} alt="logo" />
      </RightDiv>
    </>
  );
};

export default Login;
