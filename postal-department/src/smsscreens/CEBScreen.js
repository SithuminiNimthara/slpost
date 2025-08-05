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
import { Picker } from "@react-native-picker/picker";
import { sendSms } from "../utils/sendEcounterSms";

const EcbSmsScreen = () => {
  const [acct, setAcct] = useState("");
  const [zone, setZone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyMsg, setReplyMsg] = useState("");

  const zoneOptions = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "E/14",
    "D/15",
  ];

  const handleSubmit = async () => {
    const rawAcct = acct.replace(/\D/g, ""); // Ensure digits only

    if (!rawAcct || !zone || !amount) {
      return alert("All fields are required.");
    }

    if (rawAcct.length !== 10) {
      return alert("Account Number must be exactly 10 digits.");
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount)) {
      return alert("Amount must be a valid number.");
    }

    try {
      setLoading(true);
      setReplyMsg("");

      const response = await sendSms("ecb", {
        acct: rawAcct,
        zone,
        amount: numAmount,
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
            {/* Account Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                style={styles.input}
                value={acct}
                onChangeText={(text) =>
                  setAcct(text.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="e.g., 1234567890"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            {/* Zone Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Zone</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={zone}
                  onValueChange={(value) => setZone(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Zone --" value="" />
                  {zoneOptions.map((z) => (
                    <Picker.Item key={z} label={z} value={z} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Amount */}
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

            {/* Loading */}
            {loading && (
              <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color="#9C1D1D" />
                <Text style={styles.loadingText}>Sending SMS...</Text>
              </View>
            )}

            {/* Button */}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Send SMS</Text>
            </TouchableOpacity>

            {/* Reply */}
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    width: "100%",
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

export default EcbSmsScreen;
