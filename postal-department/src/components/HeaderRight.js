import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // ✅ added
import { AuthContext } from "../context/AuthContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const HeaderRight = () => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation(); // ✅ added

  if (!user) return null;

  const handleLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to log out?");
      if (confirmed) {
        logout();
      }
    } else {
      Alert.alert("Logout", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.infoContainer}>
        <Text style={styles.text}>{user.Name}</Text>
        <Text style={styles.text}>{user.Location}</Text>
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
        <MaterialCommunityIcons name="account-circle" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  infoContainer: {
    alignItems: "flex-end",
    marginRight: 8,
  },
  text: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
  },
  iconButton: {
    padding: 2,
    borderRadius: 16,
  },
});

export default HeaderRight;
