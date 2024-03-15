import { ConfigProvider } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/Auth";
import { UserTypeProvider } from "./contexts/UserTypeContext";

import Template from "./components/template/Template";
import PrivatePage from "./utils/PrivatePage";

import Dashboard from "./pages/dashboard/Dashboard";
import CreateEmployee from "./pages/employees/createEmployee";
import ListEmployee from "./pages/employees/listEmployee";
import Login from "./pages/login/Login";

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4168B0",
          colorPrimaryLight: "#E9F2EF",
          colorPrimaryDark: "#264653",
          colorSecondary: "#E9C46A",
          colorSecondaryLight: "#F4A261",
          colorSecondaryDark: "#E76F51",
          colorLink: "#4168B0",
        },
      }}
    >
      <BrowserRouter>
        <UserTypeProvider>
          <AuthProvider>
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <PrivatePage>
                    <Template>
                      <Dashboard />
                    </Template>
                  </PrivatePage>
                }
              />
              <Route
                path="/employee/create"
                element={
                  <PrivatePage>
                    <Template>
                      <CreateEmployee />
                    </Template>
                  </PrivatePage>
                }
              />
              <Route
                path="/employee/list"
                element={
                  <PrivatePage>
                    <Template>
                      <ListEmployee />
                    </Template>
                  </PrivatePage>
                }
              />
            </Routes>
            <ToastContainer />
          </AuthProvider>
        </UserTypeProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
