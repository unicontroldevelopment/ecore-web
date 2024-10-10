/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

const UserTypeContext = createContext();

const UserTypeProvider = ({ children }) => {
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    const storedUserId = localStorage.getItem("userId");
    const storedUserData = localStorage.getItem("user");
    

    if (storedUserType) {
      setUserType(storedUserType);
    }

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
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
      if (e.key === "userData") {
        setUserData(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType, userId, setUserId, userData, setUserData }}>
      {children}
    </UserTypeContext.Provider>
  );
};

export { UserTypeContext, UserTypeProvider };

