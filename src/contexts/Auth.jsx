/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import * as React from "react";

import toastError from "../components/toasts/toastError";
import toastSuccess from "../components/toasts/toastSuccess";
import toastInfo from "../components/toasts/toastInfo";

import { api } from "../services/api";
import UserService from "../services/UserService";
import { UserTypeContext } from "./UserTypeContext";

const userService = new UserService();

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const context = React.useContext(UserTypeContext);

  React.useEffect(() => {
    const recoveredUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (recoveredUser && token) {
      setUser(JSON.parse(recoveredUser));
      context.setUserType(JSON.parse(recoveredUser).userType);
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }

    setLoading(false);
  }, []);

  const logoutAuth = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    context.setUserType(null);
    api.defaults.headers.Authorization = null;
    setUser(null);
    toastInfo("Logue-se para acessar o sistema!");
    navigate("/");
  };

  const loginAuth = async (email, password) => {
    try {
      const response = await userService.login(email, password);

      const loggedUser = response.data.user;
      const token = response.data.token;

      context.setUserType(loggedUser.role);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("token", token);

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(loggedUser);
      navigate("/dashboard");
      toastSuccess("Login realizado com sucesso!");
    } catch (error) {
      toastError(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ authenticated: !!user, user, loginAuth, loading, logoutAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
