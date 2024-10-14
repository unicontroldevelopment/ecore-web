/* eslint-disable react/prop-types */
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Toast } from "../components/toasts";

import Loading from "../components/animations/Loading";
import { api } from "../services/api";
import EmployeeService from "../services/EmployeeService";
import { UserTypeContext } from "./UserTypeContext";

const employeeService = new EmployeeService();

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const { setUserType, updateUserData, clearUserData } = React.useContext(UserTypeContext);

  React.useEffect(() => {
    const handle = async () => {
      const recoveredUser = await JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      if (recoveredUser && token) {
        setUser(recoveredUser);
        await setUserType(recoveredUser.role.map((role) => role.role.name));
        api.defaults.headers.Authorization = `Bearer ${token}`;
      }
      setLoading(false);
    };
    handle();
  }, [setUserType]);

  const logoutAuth = () => {
    localStorage.removeItem("token");
    clearUserData();
    api.defaults.headers.Authorization = null;
    setUser(null);
    Toast.Info("Logue-se para acessar o sistema!");
    navigate("/");
  };

  const loginAuth = async (email, password) => {
    try {
      const response = await employeeService.login(email, password);

      if (response.response?.status === 422) {
        Toast.Error(response.response.data.message);
      } else if (response.response?.status === 500) {
        Toast.Error("E-mail incorreto ou não cadastrado!");
      } else {
        const loggedUser = response.data.user;
        const token = response.data.token;
  
        setUserType(loggedUser.role.map(role => role.role.name));
        updateUserData(loggedUser);
        localStorage.setItem("token", token);
        
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser(loggedUser);
        navigate("/dashboard");
        Toast.Success("Login realizado com sucesso!");
      }
    } catch (error) {
      console.log(error);
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