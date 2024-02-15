import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UserTypeProvider } from "./contexts/UserTypeContext";

import Login from "./pages/login/Login";

const App = () => {
  return (
    <UserTypeProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </UserTypeProvider>
  );
};

export default App;
