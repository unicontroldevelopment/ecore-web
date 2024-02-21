import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ConfigProvider } from "antd";
import "react-toastify/dist/ReactToastify.css";

import { UserTypeProvider } from "./contexts/UserTypeContext";

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
      <UserTypeProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </UserTypeProvider>
    </ConfigProvider>
  );
};

export default App;
