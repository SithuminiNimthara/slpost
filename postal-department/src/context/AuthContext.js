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
      // Real API login logic
      const response = await axios.post(
        //"https://slpmail.slpost.gov.lk/appapi/appuser.php",
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

        alert(
          `Login Successful!\n\nUser ID: ${userData.User_id}\nName: ${userData.Name}\nLocation: ${userData.Location}\nLocation ID: ${userData.Location_id}\nPrivilege: ${userData.privilege}\nBeat No: ${userData.beats}`
        );
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
      console.error("Login Error:", error);
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
