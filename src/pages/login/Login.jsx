/* eslint-disable react/no-unknown-property */
import * as React from "react";
// import api from "../../service/api";
import { useNavigate } from "react-router-dom";

import logo_slogan from "../../assets/logo_slogan.png";

import { UserTypeContext } from "../../contexts/UserTypeContext";

// import toastError from "../../utils/toastError";

// import LoadingRocket from "../../components/animations/LoadingRocket";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { Row, Col, Button } from "antd";

// import styles from "../../styles/login.module.css";
import { Subtitle, Title, CenteredDiv, LeftDiv, RightDiv } from "./styles";

const Login = () => {
  // eslint-disable-next-line
  const context = React.useContext(UserTypeContext);
  //   const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);

  //   useEffect(() => {
  //     if (cookies.jwt) {
  //       navigate("/");
  //     }
  //   }, [cookies, navigate]);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  console.log(email, password);

  const forgetPassword = () => {
    navigate("/forget-password");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // setLoading(true);
    // try {
    //   const { data } = await api.post(
    //     "/login",
    //     {
    //       ...values,
    //     },
    //     { withCredentials: true }
    //   );
    //   const id = data.user;
    //   if (data) {
    // api.post("/api/buscaCargoPorId", { id }).then((response) => {
    //   context.setUserType(response.data);
    //   localStorage.setItem("userType", response.data);
    // });

    // if (data.errors) {
    //   const { email, password } = data.errors;
    //   if (email) {
    //     // toastError(email);
    //     // setLoading(false);
    //   } else if (password) {
    //     // toastError(password);
    //     // setLoading(false);
    //   }
    // } else {
    //   //   process.env.REACT_APP_VERIFY_BRANCH
    //   //     ? setCookie(
    //   //         process.env.REACT_APP_NAME_COOKIE,
    //   //         process.env.REACT_APP_SECRET_COOKIE
    //   //       )
    //   //     : setCookie();
    //   //   setTimeout(() => {
    //   //     setLoading(false);
    //   //     navigate("/dashboard");
    //   //   }, 500);
    // }
  };
  // } catch (ex) {
  //   console.log(ex);
  // }
  //   };

  const handleClickShowPassword = () => {
    setIsVisible(!isVisible);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      {/* {loading ? <LoadingRocket /> : null} */}
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
              <Button type="primary">Entrar</Button>
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
