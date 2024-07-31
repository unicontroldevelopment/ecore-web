import * as React from "react";
import { useNavigate } from "react-router-dom";
import { UserTypeContext } from "../contexts/UserTypeContext";

function VerifyUserRole(roles) {
  const navigate = useNavigate();
  const userTypeContext = React.useContext(UserTypeContext);

  React.useEffect(() => {
    const verifyUser = () => {
      if (!Array.isArray(userTypeContext.userType) || !userTypeContext.userType.length) return;

      const userRoles = userTypeContext.userType.map(role => {
        if (typeof role === 'object' && role.role) {
          return role.role.name;
        }
        return role;
      });

      const hasAccess = userRoles.some(userRole => roles.includes(userRole));

      if (!hasAccess) {
        navigate("/accessDenied");
      }
    };
    verifyUser();
  }, []);

  return null;
}

export default VerifyUserRole;