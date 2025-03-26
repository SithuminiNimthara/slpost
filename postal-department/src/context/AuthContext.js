import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);

  const login = (username, password) => {
    setIsLoading(true);
    
    // Simulating user verification
    if (username === "admin" && password === "12345") {
      setTimeout(() => {
        setUserToken("admin-token");
        setIsLoading(false);
      }, 1000); // Simulate network delay
    } else {
      setTimeout(() => {
        setUserToken(null);
        setIsLoading(false);
        alert("Invalid username or password");
      }, 1000);
    }
  };

  const logout = () => {
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};
