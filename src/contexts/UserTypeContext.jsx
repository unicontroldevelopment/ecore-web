/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

const UserTypeContext = createContext();

const UserTypeProvider = ({ children }) => {
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    const storedUserId = localStorage.getItem("userId");

    if (storedUserType) {
      setUserType(storedUserType);
    }

    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "userId") {
        setUserId(e.newValue);
      }
      if (e.key === "userType") {
        setUserType(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType, userId, setUserId }}>
      {children}
    </UserTypeContext.Provider>
  );
};

export { UserTypeContext, UserTypeProvider };
