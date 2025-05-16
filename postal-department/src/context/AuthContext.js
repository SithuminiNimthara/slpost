import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Load user session from AsyncStorage on app start
  useEffect(() => {
    AsyncStorage.getItem("user_data").then((data) => {
      if (data) setUser(JSON.parse(data));
    });
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://slpmail.slpost.gov.lk/appapi/appuser.php",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (data.Status === "Success") {
        // Store all user data
        const userData = {
          User_id: data.User_id,
          Name: data.Name,
          Location: data.Location,
          Location_id: data.Location_id,
          privilege: data.privilege,
        };
        await AsyncStorage.setItem("user_data", JSON.stringify(userData));
        setUser(userData);
        alert(`Success\n${JSON.stringify(data, null, 2)}`);
      } else if (data.Status === "Error" && data.Error === "Invalid username") {
        setUser(null);
        alert("Invalid username");
      } else if (
        data.Status === "Error" &&
        data.Error === "Invalid Usrename or Password"
      ) {
        setUser(null);
        alert("Invalid username or password");
      } else {
        setUser(null);
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      setUser(null);
      alert("Network or server error. Please try again.");
      console.error(error);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    console.log("Logout called");
    setUser(null);
    await AsyncStorage.removeItem("user_data");
  };

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
};
