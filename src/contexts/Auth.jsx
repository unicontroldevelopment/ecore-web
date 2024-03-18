/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import * as React from "react";

import { Toast } from "../components/toasts";

import { api } from "../services/api";
import EmployeeService from "../services/EmployeeService";
import { UserTypeContext } from "./UserTypeContext";
import Loading from "../components/animations/Loading";

const employeeService = new EmployeeService();

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const context = React.useContext(UserTypeContext);

  React.useEffect(() => {
    const handle = async () => {
      const recoveredUser = await JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      if (recoveredUser && token) {
        setUser(recoveredUser);
        await context.setUserType(recoveredUser.role);
        api.defaults.headers.Authorization = `Bearer ${token}`;
      }
      setLoading(false);
    };
    handle();
  }, []);

  const logoutAuth = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    context.setUserType(null);
    api.defaults.headers.Authorization = null;
    setUser(null);
    Toast.Info("Logue-se para acessar o sistema!");
    navigate("/");
  };

  const loginAuth = async (email, password) => {
    try {
      const response = await employeeService.login(email, password);

      const loggedUser = response.data.user;
      const token = response.data.token;

      context.setUserType(loggedUser.role);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("token", token);

      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(loggedUser);
      navigate("/dashboard");
      Toast.Success("Login realizado com sucesso!");
    } catch (error) {
      Toast.Error(error.message);
    }
  };

  if (loading) {
    return <Loading />;
  } else {
    return (
      <AuthContext.Provider
        value={{ authenticated: !!user, user, loginAuth, loading, logoutAuth }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
};
