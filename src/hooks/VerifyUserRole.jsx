import * as React from "react";
import { useNavigate } from "react-router-dom";
import { UserTypeContext } from "../contexts/UserTypeContext";

function VerifyUserRole(roles) {
  const navigate = useNavigate();
  const userTypeContext = React.useContext(UserTypeContext);

  React.useEffect(() => {
    const verifyUser = () => {
      if (!roles.includes(userTypeContext.userType)) {
        navigate("/accessDenied");
      }
    };
    verifyUser();
  }, []);
}

export default VerifyUserRole;
