/* eslint-disable react/no-unknown-property */
import * as React from "react";
// import api from "../../service/api";
// import { useNavigate } from "react-router-dom";

import logotipo from "../../assets/logotipo.png";

import { UserTypeContext } from "../../contexts/UserTypeContext";

// import toastError from "../../utils/toastError";

// import LoadingRocket from "../../components/animations/LoadingRocket";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";

import styles from "../../styles/login.module.css";

const Login = () => {
  // eslint-disable-next-line
  const context = React.useContext(UserTypeContext);
  //   const [loading, setLoading] = useState(false);
  //   const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);

  //   useEffect(() => {
  //     if (cookies.jwt) {
  //       navigate("/");
  //     }
  //   }, [cookies, navigate]);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  console.log(email, password);

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
      <div className={styles.container}>
        <main className={styles.subContainer}>
          <div className={styles.logo}>
            <img src={logotipo} alt={"logo-principal"} />
          </div>
          <form onSubmit={(e) => handleSubmit(e)} className={styles.formLogin}>
            <div className={styles.inputs}>
              <TextField
                sx={{
                  width: "100%",
                }}
                label="Email"
                variant="outlined"
                type="email"
                name="email"
                autoComplete="on"
                size="small"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputs}>
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
            </div>
            <input type="submit" value="Entrar" position="right center" />
          </form>
        </main>
      </div>
    </>
  );
};

export default Login;
