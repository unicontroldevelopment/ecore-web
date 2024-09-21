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
import DesignerContextProvider from "./components/formBuilder/context/DesignerContext";
import AccessDenied from "./pages/accessDenied";
import Dashboard from "./pages/dashboard/Dashboard";
import AdditiveAndReajustment from "./pages/documents/additiveAndReajustment";
import CreateContract from "./pages/documents/createContract";
import CreateDocument from "./pages/documents/createDocument";
import CreateService from "./pages/documents/createService";
import LooseAdditive from "./pages/documents/looseAdditive";
import ManageContracts from "./pages/documents/manageContratcs";
import CreateEmail from "./pages/emails/createEmail";
import ListEmails from "./pages/emails/listEmails";
import CreateEmployee from "./pages/employees/createEmployee";
import CreateEmployeeInfo from "./pages/employees/createEmployeeInfo";
import ListEmployee from "./pages/employees/listEmployee";
import ManageEmployeeInfo from "./pages/employees/manageEmployeeInfo";
import WorkingHours from "./pages/employees/workingHours";
import Login from "./pages/login/Login";
import CreateAccess from "./pages/serverAccess/createAccess";
import ListServerAccess from "./pages/serverAccess/listAccess";
import StockMovements from "./pages/stock/movements";
import RegisterEPI from "./pages/stock/registerEPI";
import RegisterProduct from "./pages/stock/registerProduct";
import StockControl from "./pages/stock/stockControl";
import Teste from "./pages/test";
import BuilderPage from "./pages/test/FormBuilder";
import FormDetails from "./pages/test/FormDetails";
import FormSubmit from "./pages/test/FormSubmit";

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
              <DesignerContextProvider>
                <Routes>
                  <Route exact path="/" element={<Login />} />
                  <Route path="/submit/:id" element={<FormSubmit />} />
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
                    path="/employee/workingHours"
                    element={
                      <PrivatePage>
                        <Template>
                          <WorkingHours />
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
                    path="/emails/list"
                    element={
                      <PrivatePage>
                        <Template>
                          <ListEmails />
                        </Template>
                      </PrivatePage>
                    }
                  />
                  <Route
                    path="/documents/createService"
                    element={
                      <PrivatePage>
                        <Template>
                          <CreateService />
                        </Template>
                      </PrivatePage>
                    }
                  />
                  <Route
                    path="/documents/createDocument"
                    element={
                      <PrivatePage>
                        <Template>
                          <CreateDocument />
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
                  <Route
                    path="/documents/:id/additive-reajustments"
                    element={
                      <PrivatePage>
                        <Template>
                          <AdditiveAndReajustment />
                        </Template>
                      </PrivatePage>
                    }
                  />
                  <Route
                    path="/documents/customers"
                    element={
                      <PrivatePage>
                        <Template>
                          <LooseAdditive />
                        </Template>
                      </PrivatePage>
                    }
                  />
                  <Route
                    path="/stock/registerProduct"
                    element={
                      <PrivatePage>
                        <Template>
                          <RegisterProduct />
                        </Template>
                      </PrivatePage>
                    }
                  />
                  <Route
                    path="/stock/registerEPI"
                    element={
                      <PrivatePage>
                        <Template>
                          <RegisterEPI />
                        </Template>
                      </PrivatePage>
                    }
                  />
                  <Route
                    path="/stock/control"
                    element={
                      <PrivatePage>
                        <Template>
                          <StockControl />
                        </Template>
                      </PrivatePage>
                    }
                  />
                  <Route
                    path="/stock/movements"
                    element={
                      <PrivatePage>
                        <Template>
                          <StockMovements />
                        </Template>
                      </PrivatePage>
                    }
                  />
                  <Route
                    path="/forms"
                    element={
                      <PrivatePage>
                        <Template>
                          <Teste />
                        </Template>
                      </PrivatePage>
                    }
                  />
                  <Route
                    path="/builder/:id"
                    element={
                      <PrivatePage>
                        <Template>
                          <BuilderPage />
                        </Template>
                      </PrivatePage>
                    }
                  />
                  <Route
                    path="/form/:id"
                    element={
                      <PrivatePage>
                        <Template>
                          <FormDetails />
                        </Template>
                      </PrivatePage>
                    }
                  />
                </Routes>
                <ToastContainer />
                </DesignerContextProvider>
              </AuthProvider>
            </UserTypeProvider>
          </BrowserRouter>
        </ConfigProvider>
  );
};

export default App;
