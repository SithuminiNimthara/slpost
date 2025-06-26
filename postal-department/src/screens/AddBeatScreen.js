import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "../styles/addBeatStyles";

const AddBeatScreen = () => {
  const [beatNumber, setBeatNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [officeId, setOfficeId] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user_data");
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.User_id || "");
          setOfficeId(user.Location_id || user.office_id || "");
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };
    loadUserData();
  }, []);

  const handleSubmit = async () => {
    if (!beatNumber.trim()) {
      Alert.alert("Validation", "Please enter a beat number.");
      return;
    }

    if (!userId || !officeId) {
      Alert.alert("Error", "User ID or Office ID is missing.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user_id: userId,
        office_id: officeId,
        beat_nos: parseInt(beatNumber.trim(), 10),
      };

      const response = await axios.post(
        "https://ec.slpost.gov.lk/slpmail/forwardAddbeat.php",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      if (response.data && response.data.Status === "Success") {
        Alert.alert(
          "Success",
          response.data.Message || "Beat updated successfully!"
        );
        setBeatNumber("");

        // ✅ Update user_data in AsyncStorage with new beat number
        const userData = await AsyncStorage.getItem("user_data");
        if (userData) {
          const user = JSON.parse(userData);
          user.beats = beatNumber;
          await AsyncStorage.setItem("user_data", JSON.stringify(user));
        }
      } else {
        Alert.alert(
          "Error",
          response.data?.Message || "Failed to update beat number."
        );
      }
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.Message || "Failed to update beat number."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Beat Number"
        placeholderTextColor="#999"
        value={beatNumber}
        onChangeText={setBeatNumber}
        keyboardType="numeric"
        editable={!loading}
      />
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>
      {loading && (
        <ActivityIndicator
          size="small"
          color="#B32A2A"
          style={{ marginTop: 10 }}
        />
      )}
    </View>
  );
};

export default AddBeatScreen;
