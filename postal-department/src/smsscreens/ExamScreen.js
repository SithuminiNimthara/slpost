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
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
} from "react-native";
import { sendSms } from "../utils/sendEcounterSms";

const ExamSmsScreen = () => {
  const [refNo, setRefNo] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [amount, setAmount] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!refNo || !verificationCode || !amount) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      Alert.alert("Error", "Amount must be a positive number.");
      return;
    }

    try {
      setLoading(true);
      const response = await sendSms("exam", {
        refNo,
        verificationCode,
        amount,
      });

      if (response?.status === "success") {
        setReplyMsg(response.fullMessage);
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ref No</Text>
              <TextInput
                style={styles.input}
                value={refNo}
                onChangeText={setRefNo}
                placeholder="Enter Ref No"
                placeholderTextColor="#999"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={styles.input}
                value={verificationCode}
                onChangeText={setVerificationCode}
                placeholder="Enter Verification Code"
                placeholderTextColor="#999"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (Rs)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="e.g., 1000"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            {loading && (
              <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color="#9C1D1D" />
                <Text style={styles.loadingText}>Waiting for SMS reply...</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Send SMS</Text>
            </TouchableOpacity>

            {replyMsg !== "" && (
              <View style={styles.replyBox}>
                <Text style={styles.replyTitle}>Reply from 1919:</Text>
                <Text style={styles.replyText}>{replyMsg}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
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
  replyBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#914c4cff",
    borderRadius: 10,
    borderColor: "#9C1D1D",
    borderWidth: 1,
  },
  replyTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 15,
    color: "#fff",
  },
  replyText: {
    fontSize: 15,
    color: "#fff",
  },
});

export default ExamSmsScreen;
