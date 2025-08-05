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
import styles from "../styles/smskmcStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const KmcSmsScreen = () => {
  const [paymentType, setPaymentType] = useState("assessment");
  const [taxNo, setTaxNo] = useState("");
  const [confirmTaxNo, setConfirmTaxNo] = useState("");
  const [acctNo, setAcctNo] = useState("");
  const [confirmAcctNo, setConfirmAcctNo] = useState("");
  const [amount, setAmount] = useState("");
  const [customerMobileNo, setCustomerMobileNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConfirmingTaxNo, setIsConfirmingTaxNo] = useState(false);
  const [isConfirmingAcctNo, setIsConfirmingAcctNo] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

  // Check mismatches depending on payment type
  const taxNoMismatch =
    paymentType === "assessment" &&
    taxNo &&
    confirmTaxNo &&
    taxNo !== confirmTaxNo;

  const acctNoMismatch =
    paymentType === "waterbill" &&
    acctNo &&
    confirmAcctNo &&
    acctNo !== confirmAcctNo;

  // Calculate total amount with Rs. 20 charge
  const totalWithCharge =
    amount && !isNaN(amount) && Number(amount) > 0
      ? (Number(amount) + 20).toFixed(2)
      : null;

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

    if (taxNoMismatch || acctNoMismatch) {
      Alert.alert("Error", "Account or Tax numbers do not match.");
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
        amount: totalWithCharge ? Number(totalWithCharge) : null,
        customerMobileNo,
      };

      let smsType = "";

      if (paymentType === "assessment") {
        smsType = "kmc_assessment";
        payload.taxNo = confirmTaxNo; // use confirmed value
      } else if (paymentType === "waterbill") {
        smsType = "kmc_waterbill";
        payload.acctNo = confirmAcctNo; // use confirmed value
      }

      const response = await sendSms(smsType, payload);

      if (response?.status === "success") {
        setReplyMessage(response.fullMessage); // Store the reply
      } else {
        setReplyMessage("SMS sent but no reply received.");
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
                {/* Tax Number Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Tax No</Text>
                  <TextInput
                    style={styles.input}
                    value={taxNo}
                    onChangeText={setTaxNo}
                    placeholder="Enter Tax Number"
                    placeholderTextColor="#999"
                    maxLength={10}
                    secureTextEntry={isConfirmingTaxNo}
                  />
                </View>

                {/* Confirm Tax Number Input with blur */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Tax No</Text>
                  <TextInput
                    style={[
                      styles.input,
                      taxNoMismatch ? styles.inputError : null,
                    ]}
                    value={confirmTaxNo}
                    onChangeText={(text) => setConfirmTaxNo(text)}
                    placeholder="Re-enter Tax Number"
                    placeholderTextColor="#999"
                    maxLength={10}
                    onFocus={() => setIsConfirmingTaxNo(true)}
                    onBlur={() => setIsConfirmingTaxNo(false)}
                    secureTextEntry={isConfirmingTaxNo}
                  />
                  {taxNoMismatch && confirmTaxNo.length > 0 && (
                    <Text style={styles.matchWarning}>
                      Tax numbers do not match.
                    </Text>
                  )}
                </View>
              </>
            ) : (
              <>
                {/* Account Number Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Account No</Text>
                  <TextInput
                    style={styles.input}
                    value={acctNo}
                    onChangeText={setAcctNo}
                    placeholder="Enter Account Number"
                    placeholderTextColor="#999"
                    maxLength={10}
                    secureTextEntry={isConfirmingAcctNo}
                  />
                </View>

                {/* Confirm Account Number Input with blur */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm Account No</Text>
                  <TextInput
                    style={[
                      styles.input,
                      acctNoMismatch ? styles.inputError : null,
                    ]}
                    value={confirmAcctNo}
                    onChangeText={(text) => setConfirmAcctNo(text)}
                    placeholder="Re-enter Account Number"
                    placeholderTextColor="#999"
                    maxLength={10}
                    onFocus={() => setIsConfirmingAcctNo(true)}
                    onBlur={() => setIsConfirmingAcctNo(false)}
                    secureTextEntry={isConfirmingAcctNo}
                  />
                  {acctNoMismatch && confirmAcctNo.length > 0 && (
                    <Text style={styles.matchWarning}>
                      Account numbers do not match.
                    </Text>
                  )}
                </View>
              </>
            )}

            {/* Amount + Total Row */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (Rs)</Text>
              <View style={styles.amountRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 10 }]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="e.g., 2500"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
                {totalWithCharge && (
                  <View style={styles.totalBox}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>Rs. {totalWithCharge}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Customer Mobile Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Customer Mobile No</Text>
              <TextInput
                style={styles.input}
                value={customerMobileNo}
                onChangeText={setCustomerMobileNo}
                placeholder="e.g., 07XXXXXXXXX"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {/* Loading Indicator */}
            {loading && (
              <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color="#9C1D1D" />
                <Text style={styles.loadingText}>Waiting for SMS reply...</Text>
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

            {/* Show Reply Message as Card Below the Button */}
            {replyMessage && (
              <View style={styles.replyCard}>
                <Text style={styles.replyTitle}>Reply Message</Text>
                <Text style={styles.replyText}>{replyMessage}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default KmcSmsScreen;
