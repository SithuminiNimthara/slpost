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

// Format input as XX/XXX/XXX/XX (13 digits with slashes)
const formatAccountNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 13);
  let formatted = "";
  for (let i = 0; i < digits.length; i++) {
    formatted += digits[i];
    if ([1, 4, 7].includes(i) && i !== digits.length - 1) {
      formatted += "/";
    }
  }
  return formatted;
};

const WaterBillSmsScreen = () => {
  const [acct, setAcct] = useState("");
  const [confirmAcct, setConfirmAcct] = useState("");
  const [amount, setAmount] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const rawAcct = acct.replace(/\D/g, "");
    const rawConfirmAcct = confirmAcct.replace(/\D/g, "");

    if (!rawAcct || !rawConfirmAcct || !amount || !mobileNo) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (rawAcct.length !== 10) {
      Alert.alert("Error", "Account Number must contain exactly 10 digits.");
      return;
    }

    if (rawAcct !== rawConfirmAcct) {
      Alert.alert("Error", "Account numbers do not match.");
      return;
    }

    if (!/^\d{10}$/.test(mobileNo)) {
      Alert.alert("Error", "Mobile Number must be exactly 10 digits.");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      Alert.alert("Error", "Amount must be a positive number.");
      return;
    }

    try {
      setLoading(true); // Start loading

      const response = await sendSms("water", {
        acct: rawAcct,
        amount,
        mobileNo,
      });

      if (response?.status === "success") {
        setReplyMsg(response.fullMessage); // store the reply
        Alert.alert("Reply from 1919", response.fullMessage);
      } else {
        Alert.alert("Error", "SMS sent but no reply received.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send SMS.");
    } finally {
      setLoading(false); // Stop loading regardless of success/failure
    }
  };

  const handleViewDetails = () => {
    Alert.alert("Info", "Here you can show account details or redirect.");
    // You can navigate to another screen or show a modal here
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
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                value={acct}
                onChangeText={(text) => setAcct(formatAccountNumber(text))}
                placeholder="e.g., 12/234/234/56"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={13}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Account Number</Text>
              <TextInput
                style={styles.input}
                value={confirmAcct}
                onChangeText={(text) =>
                  setConfirmAcct(formatAccountNumber(text))
                }
                placeholder="e.g., 12/234/234/56"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={13}
              />

              {/* View Details Button */}
              <TouchableOpacity
                style={styles.viewDetailsBtn}
                onPress={handleViewDetails}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (Rs)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="e.g., 1200"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={mobileNo}
                onChangeText={setMobileNo}
                placeholder="e.g., 0771234567"
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
  viewDetailsBtn: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewDetailsText: {
    color: "#9C1D1D",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 4,
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
  spinnerContainer: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },
});

export default WaterBillSmsScreen;
