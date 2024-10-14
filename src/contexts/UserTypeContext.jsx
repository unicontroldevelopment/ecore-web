import { createContext, useCallback, useEffect, useState } from "react";

const UserTypeContext = createContext();

const UserTypeProvider = ({ children }) => {
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  const updateUserData = useCallback((data) => {
    setUserData(data);
    localStorage.setItem("user", JSON.stringify(data));
  }, []);

  const updateUserType = useCallback((type) => {
    setUserType(type);
    localStorage.setItem("userType", JSON.stringify(type));
  }, []);

  const clearUserData = useCallback(() => {
    setUserType("");
    setUserId(null);
    setUserData(null);
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  }, []);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    const storedUserId = localStorage.getItem("userId");
    const storedUserData = localStorage.getItem("user");

    if (storedUserType) setUserType(JSON.parse(storedUserType));
    if (storedUserId) setUserId(storedUserId);
    if (storedUserData) setUserData(JSON.parse(storedUserData));
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "userId") setUserId(e.newValue);
      if (e.key === "userType") setUserType(JSON.parse(e.newValue));
      if (e.key === "user") setUserData(JSON.parse(e.newValue));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <UserTypeContext.Provider 
      value={{ 
        userType, 
        setUserType: updateUserType, 
        userId, 
        setUserId, 
        userData, 
        updateUserData,
        clearUserData
      }}
    >
      {children}
    </UserTypeContext.Provider>
  );
};

export { UserTypeContext, UserTypeProvider };
