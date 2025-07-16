import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { sendSms } from "../utils/sendEcounterSms";

const CeylincoSmsScreen = () => {
  const [policyNumber, setPolicyNumber] = useState("");
  const [nicLast6, setNicLast6] = useState("");
  const [amount, setAmount] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!policyNumber || !nicLast6 || !amount || !contactNumber) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (!/^\d{6}$/.test(nicLast6)) {
      Alert.alert("Error", "NIC Last 6 Digits must be exactly 6 numbers.");
      return;
    }

    if (!/^\d{10}$/.test(contactNumber)) {
      Alert.alert("Error", "Contact Number must be exactly 10 digits.");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      Alert.alert("Error", "Amount must be a positive number.");
      return;
    }

    try {
      setLoading(true);
      const response = await sendSms("cyl", {
        policyNumber,
        nicLast6,
        amount,
        contactNumber,
      });

      if (response?.status === "success") {
        Alert.alert("Reply from 1919", response.fullMessage);
      } else {
        Alert.alert("Error", "SMS sent but no reply received.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send SMS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Policy Number</Text>
            <TextInput
              style={styles.input}
              value={policyNumber}
              onChangeText={setPolicyNumber}
              placeholder="Enter policy number"
              placeholderTextColor="#999"
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NIC Last 6 Digits</Text>
            <TextInput
              style={styles.input}
              value={nicLast6}
              onChangeText={setNicLast6}
              placeholder="e.g. 123456"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount (Rs)</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="e.g. 5000"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={styles.input}
              value={contactNumber}
              onChangeText={setContactNumber}
              placeholder="e.g. 0712345678"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {loading && (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator size="large" color="#9C1D1D" />
              <Text style={styles.loadingText}>Waiting for SMS reply...</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Send SMS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f2f5",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#222",
  },
  button: {
    backgroundColor: "#9C1D1D",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  spinnerContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },
});

export default CeylincoSmsScreen;
