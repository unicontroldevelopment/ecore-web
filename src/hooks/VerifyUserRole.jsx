import * as React from "react";
import { useNavigate } from "react-router-dom";
import { UserTypeContext } from "../contexts/UserTypeContext";

function VerifyUserRole(allowedRoles) {
  const navigate = useNavigate();
  const { userType } = React.useContext(UserTypeContext);

  React.useEffect(() => {
    const verifyUser = () => {
      
      if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
        console.error("VerifyUserRole: Invalid roles provided");
        return;
      }

      if (!userType) {
        navigate("/accessDenied");
        return;
      }

      let userRoles = [];
      if (Array.isArray(userType)) {
        userRoles = userType.map(role => 
          typeof role === 'object' && role.role ? role.role.name : role
        );
      } else if (typeof userType === 'string') {
        userRoles = [userType];
      } else if (typeof userType === 'object' && userType.role) {
        userRoles = [userType.role.name];
      }

      const hasAccess = userRoles.some(userRole => 
        allowedRoles.includes(userRole) || userRole === 'master'
      );

      if (!hasAccess) {
        navigate("/accessDenied");
      }
    };

    verifyUser();
  }, [userType, allowedRoles, navigate]);

  return null;
}

export default VerifyUserRole;