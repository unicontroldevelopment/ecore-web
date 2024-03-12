import * as React from "react";
import { useNavigate } from "react-router-dom";
import { UserTypeContext } from "../contexts/UserTypeContext";

export function VerifyUserRole(userRoles) {
  const navigate = useNavigate();
  const userTypeContext = React.useContext(UserTypeContext);

  React.useEffect(() => {
    const verifyUser = () => {
      if (!userRoles.includes(userTypeContext.userType)) {
        navigate("/accessDenied");
      }
    };
    verifyUser();
  }, []);
}

export default VerifyUserRole;
