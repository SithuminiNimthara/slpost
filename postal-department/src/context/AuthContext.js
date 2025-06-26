import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false); // for login
  const [user, setUser] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false); // for startup

  useEffect(() => {
    const resetSession = async () => {
      await AsyncStorage.removeItem("user_data"); // clear saved session
      setUser(null);
      setIsAppReady(true); // now app can render login
    };
    resetSession();
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://ec.slpost.gov.lk/slpmail/forwardUser.php",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;

      if (data.Status === "Success") {
        const userData = {
          User_id: data.User_id,
          Name: data.Name,
          Location: data.Location,
          Location_id: data.Location_id,
          privilege: data.privilege,
          beats: data.beats,
        };
        await AsyncStorage.setItem("user_data", JSON.stringify(userData));
        setUser(userData);
        alert(`Welcome! Login successful.\n${userData.Name} as ${userData.privilege} logged to ${userData.Location}.`);
      } else if (data.Error === "Invalid username") {
        setUser(null);
        alert("Invalid username");
      } else if (data.Error === "Invalid Usrename or Password") {
        setUser(null);
        alert("Invalid username or password");
      } else {
        setUser(null);
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      setUser(null);
      alert("Network or server error. Please try again.");
      console.error("Login Error:", error);
    }

    setIsLoading(false);
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user_data");
  };

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, isAppReady, user }}>
      {children}
    </AuthContext.Provider>
  );
};
