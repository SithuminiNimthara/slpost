import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/loginStyles";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setError(""); // Clear error before attempting login
    login(username, password);
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/sl-post.png")} style={styles.logo} />

      <Text style={styles.title}>Login to Postal Department</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
