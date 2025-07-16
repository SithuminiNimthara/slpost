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

const KmcSmsScreen = () => {
  const [paymentType, setPaymentType] = useState("assessment");
  const [taxNo, setTaxNo] = useState("");
  const [confirmTaxNo, setConfirmTaxNo] = useState("");
  const [acctNo, setAcctNo] = useState("");
  const [confirmAcctNo, setConfirmAcctNo] = useState("");
  const [amount, setAmount] = useState("");
  const [customerMobileNo, setCustomerMobileNo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      (paymentType === "assessment" && (!taxNo || !confirmTaxNo)) ||
      (paymentType === "waterbill" && (!acctNo || !confirmAcctNo)) ||
      !amount ||
      !customerMobileNo
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (paymentType === "assessment" && taxNo.trim() !== confirmTaxNo.trim()) {
      Alert.alert("Error", "Tax numbers do not match.");
      return;
    }

    if (paymentType === "waterbill" && acctNo.trim() !== confirmAcctNo.trim()) {
      Alert.alert("Error", "Account numbers do not match.");
      return;
    }

    if (!/^\d{10}$/.test(customerMobileNo)) {
      Alert.alert("Error", "Mobile Number must be exactly 10 digits.");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      Alert.alert("Error", "Amount must be a positive number.");
      return;
    }

    try {
      setLoading(true);
      let payload = {
        amount,
        customerMobileNo,
      };

      let smsType = "";

      if (paymentType === "assessment") {
        smsType = "kmc_assessment";
        payload.taxNo = taxNo;
      } else if (paymentType === "waterbill") {
        smsType = "kmc_waterbill";
        payload.acctNo = acctNo;
      }

      const response = await sendSms(smsType, payload);

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            {/* Payment Type Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  paymentType === "assessment" && styles.toggleActive,
                ]}
                onPress={() => setPaymentType("assessment")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    paymentType === "assessment" && styles.toggleTextActive,
                  ]}
                >
                  Assessment
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  paymentType === "waterbill" && styles.toggleActive,
                ]}
                onPress={() => setPaymentType("waterbill")}
              >
                <Text
                  style={[
                    styles.toggleText,
                    paymentType === "waterbill" && styles.toggleTextActive,
                  ]}
                >
                  Water Bill
                </Text>
              </TouchableOpacity>
            </View>

            {paymentType === "assessment" ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Tax No</Text>
                  <TextInput
                    style={styles.input}
                    value={taxNo}
                    onChangeText={setTaxNo}
                    placeholder="Enter Tax Number"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Tax No</Text>
                  <TextInput
                    style={styles.input}
                    value={confirmTaxNo}
                    onChangeText={setConfirmTaxNo}
                    placeholder="Re-enter Tax Number"
                    placeholderTextColor="#999"
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Account No</Text>
                  <TextInput
                    style={styles.input}
                    value={acctNo}
                    onChangeText={setAcctNo}
                    placeholder="Enter Account Number"
                    placeholderTextColor="#999"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Account No</Text>
                  <TextInput
                    style={styles.input}
                    value={confirmAcctNo}
                    onChangeText={setConfirmAcctNo}
                    placeholder="Re-enter Account Number"
                    placeholderTextColor="#999"
                  />
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (Rs)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="e.g., 2500"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Customer Mobile No</Text>
              <TextInput
                style={styles.input}
                value={customerMobileNo}
                onChangeText={setCustomerMobileNo}
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
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Send SMS</Text>
            </TouchableOpacity>
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
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: "#9C1D1D",
  },
  toggleText: {
    fontSize: 15,
    color: "#333",
  },
  toggleTextActive: {
    color: "#fff",
    fontWeight: "bold",
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

export default KmcSmsScreen;
