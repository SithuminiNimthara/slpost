import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
} from "react-native";
import { sendSms } from "../utils/sendEcounterSms";
import { getPinNo } from "../utils/getPinNo";

const MobitelSmsScreen = () => {
  const [amount, setAmount] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyMsg, setReplyMsg] = useState("");

  const handleSubmit = async () => {
    if (!amount || !mobileNo) {
      return alert("All fields are required.");
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount)) {
      return alert("Amount must be a number.");
    }

    if (!/^\d{10}$/.test(mobileNo)) {
      return alert("Mobile Number must be exactly 10 digits.");
    }

    try {
      setLoading(true);
      setReplyMsg("");

      const response = await sendSms("mobitel", {
        amount: numAmount,
        mobileNo,
      });

      if (response?.status === "success") {
        setReplyMsg(response.fullMessage);
      } else {
        setReplyMsg("SMS sent but no reply received.");
      }
    } catch (error) {
      setReplyMsg(error.message || "Failed to send SMS.");
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
            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (Rs)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="e.g., 150"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            {/* Mobile Number Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Customer Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={mobileNo}
                onChangeText={setMobileNo}
                placeholder="e.g., 07XXXXXXXX"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {/* Loading Spinner */}
            {loading && (
              <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color="#9C1D1D" />
                <Text style={styles.loadingText}>Sending SMS...</Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Send SMS</Text>
            </TouchableOpacity>

            {/* Reply Message Card */}
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
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#9C1D1D",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  spinnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  replyBox: {
    marginTop: 20,
    backgroundColor: "#e8f4ff",
    padding: 15,
    borderRadius: 8,
  },
  replyTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  replyText: {
    color: "#333",
  },
});

export default MobitelSmsScreen;
