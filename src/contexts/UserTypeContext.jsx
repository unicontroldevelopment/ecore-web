import { createContext, useCallback, useEffect, useState } from "react";

const UserTypeContext = createContext();

const UserTypeProvider = ({ children }) => {
  const [userType, setUserType] = useState("");
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);

  const updateUserData = useCallback((data) => {
    if (data) {
      setUserData(data);
      localStorage.setItem("user", JSON.stringify(data));
      if (data.id) {
        setUserId(data.id);
        localStorage.setItem("userId", data.id);
      }
      if (data.role && Array.isArray(data.role)) {
        const roles = data.role.map(role => role.role.name);
        setUserType(roles);
        localStorage.setItem("userType", JSON.stringify(roles));
      }
    }
  }, []);

  const updateUserType = useCallback((type) => {
    if (type) {
      setUserType(type);
      localStorage.setItem("userType", JSON.stringify(type));
    }
  }, []);

  const updateUserId = useCallback((id) => {
    if (id) {
      setUserId(id);
      localStorage.setItem("userId", id);
    }
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
    const loadStoredData = () => {
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
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      switch (e.key) {
        case "userId":
          setUserId(e.newValue);
          break;
        case "userType":
          setUserType(JSON.parse(e.newValue));
          break;
        case "user":
          const parsedUserData = JSON.parse(e.newValue);
          setUserData(parsedUserData);
          if (parsedUserData && parsedUserData.id) {
            setUserId(parsedUserData.id);
          }
          break;
        default:
          break;
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

