import React, { createContext, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://slpmail.slpost.gov.lk/appapi/appuser.php",
        { username: username, password: password }, // Send as JSON
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.Status === "Success") {
        await AsyncStorage.setItem("User_id", data.User_id);
        await AsyncStorage.setItem("Location_id", data.Location_id);
        setUserToken(data.User_id);
        alert(`Success\n${JSON.stringify(data, null, 2)}`);
      } else if (data.Status === "Error" && data.Error === "Invalid username") {
        setUserToken(null);
        alert("Invalid username");
      } else if (
        data.Status === "Error" &&
        data.Error === "Invalid Usrename or Password"
      ) {
        setUserToken(null);
        alert("Invalid username or password");
      } else {
        setUserToken(null);
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      setUserToken(null);
      alert("Network or server error. Please try again.");
      console.error(error);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem("User_id");
    await AsyncStorage.removeItem("Location_id");
  };

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};
