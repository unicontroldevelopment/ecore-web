import { createContext, useCallback, useEffect, useState } from "react";

const UserTypeContext = createContext();

const UserTypeProvider = ({ children }) => {
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  const updateUserData = useCallback((data) => {
    setUserData(data);
    localStorage.setItem("user", JSON.stringify(data));
    if (data && data.id) {
      setUserId(data.id);
      localStorage.setItem("userId", data.id);
    }
  }, []);

  const updateUserType = useCallback((type) => {
    setUserType(type);
    localStorage.setItem("userType", JSON.stringify(type));
  }, []);

  const updateUserId = useCallback((id) => {
    setUserId(id);
    localStorage.setItem("userId", id);
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
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      if (parsedUserData && parsedUserData.id) {
        setUserId(parsedUserData.id);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "userId") setUserId(e.newValue);
      if (e.key === "userType") setUserType(JSON.parse(e.newValue));
      if (e.key === "user") {
        const parsedUserData = JSON.parse(e.newValue);
        setUserData(parsedUserData);
        if (parsedUserData && parsedUserData.id) {
          setUserId(parsedUserData.id);
        }
      }
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
        setUserId: updateUserId, 
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

