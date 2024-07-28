/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

const UserTypeContext = createContext();

const UserTypeProvider = ({ children }) => {
  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType) {
      setUserType(userType);
    }
  }, []);
  const [userType, setUserType] = useState("");
  return (
    <UserTypeContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
};

export { UserTypeContext, UserTypeProvider };

