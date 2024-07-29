import * as React from "react";
import { useNavigate } from "react-router-dom";

import logo_slogan from "../../assets/logo_slogan.png";
import { AuthContext } from "../../contexts/Auth";
import Loading from "../../components/animations/Loading";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { Row, Col, Button } from "antd";

import { Subtitle, Title, CenteredDiv, LeftDiv, RightDiv } from "./styles";

const Login = () => {
  const { loginAuth, logoutAuth } = React.useContext(AuthContext);

  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    logoutAuth();
  }, []);

  const forgetPassword = () => {
    navigate("/forget-password");
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
              <label onClick={forgetPassword}>Esqueceu a senha?</label>
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
