import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ConfigProvider } from "antd";
import "react-toastify/dist/ReactToastify.css";

import { UserTypeProvider } from "./contexts/UserTypeContext";
import { AuthProvider } from "./contexts/Auth";

import PrivatePage from "./utils/PrivatePage";

import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";

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
                    <Dashboard />
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
