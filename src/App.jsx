import { ConfigProvider } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/Auth";
import { UserTypeProvider } from "./contexts/UserTypeContext";

import Template from "./components/template/Template";
import PrivatePage from "./utils/PrivatePage";

import ptBR from "antd/lib/locale/pt_BR";
import moment from "moment";
import "moment/locale/pt-br";
import AccessDenied from "./pages/accessDenied";
import Dashboard from "./pages/dashboard/Dashboard";
import CreateContract from "./pages/documents/createContract";
import CreateService from "./pages/documents/createService";
import ManageContracts from "./pages/documents/manageContratcs";
import CreateEmail from "./pages/emails/createEmail";
import ListGroup from "./pages/emails/listGroups";
import CreateEmployee from "./pages/employees/createEmployee";
import CreateEmployeeInfo from "./pages/employees/createEmployeeInfo";
import ListEmployee from "./pages/employees/listEmployee";
import ManageEmployeeInfo from "./pages/employees/manageEmployeeInfo";
import Login from "./pages/login/Login";
import CreateAccess from "./pages/serverAccess/createAccess";
import ListServerAccess from "./pages/serverAccess/listAccess";

moment.locale("pt-br");

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
      locale={ptBR}
    >
      <BrowserRouter>
        <UserTypeProvider>
          <AuthProvider>
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route
                path="/accessDenied"
                element={
                  <PrivatePage>
                    <Template>
                      <AccessDenied />
                    </Template>
                  </PrivatePage>
                }
              />
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
                      <CreateEmployee/>
                    </Template>
                  </PrivatePage>
                }
              />
              <Route
                path="/employee/list"
                element={
                  <PrivatePage>
                    <Template>
                      <ListEmployee/>
                    </Template>
                  </PrivatePage>
                }
              />
              <Route
                path="/employee/createInfo"
                element={
                  <PrivatePage>
                    <Template>
                      <CreateEmployeeInfo />
                    </Template>
                  </PrivatePage>
                }
              />
              <Route
                path="/employee/manageInfo"
                element={
                  <PrivatePage>
                    <Template>
                      <ManageEmployeeInfo />
                    </Template>
                  </PrivatePage>
                }
              />
              <Route
                path="/serveraccess/create"
                element={
                  <PrivatePage>
                    <Template>
                      <CreateAccess />
                    </Template>
                  </PrivatePage>
                }
              />
              <Route
                path="/serveraccess/list"
                element={
                  <PrivatePage>
                    <Template>
                      <ListServerAccess />
                    </Template>
                  </PrivatePage>
                }
              />
              <Route
                path="/emails/create"
                element={
                  <PrivatePage>
                    <Template>
                      <CreateEmail />
                    </Template>
                  </PrivatePage>
                }
              />
              <Route
                path="/emails/listGroup"
                element={
                  <PrivatePage>
                    <Template>
                      <ListGroup />
                    </Template>
                  </PrivatePage>
                }
              />
              <Route
                path="/documents/create"
                element={
                  <PrivatePage>
                    <Template>
                      <CreateService />
                    </Template>
                  </PrivatePage>
                }
              />
              <Route
                path="/documents/generateContract"
                element={
                  <PrivatePage>
                    <Template>
                      <CreateContract />
                    </Template>
                  </PrivatePage>
                }
              />
              <Route
                path="/documents/manageContracts"
                element={
                  <PrivatePage>
                    <Template>
                      <ManageContracts />
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
