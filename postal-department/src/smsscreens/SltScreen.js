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
import styles from "../styles/smssltStyles"; // your main style
const SltsmsScreen = () => {
  const [sltNumber, setSltNumber] = useState("");
  const [confirmSltNumber, setConfirmSltNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null); // <-- new state

  const handleSubmit = async () => {
    setReplyMessage(null); // clear old message
    if (!sltNumber || !confirmSltNumber || !amount || !contactNumber) {
      return alert("All fields are required.");
    }

    if (sltNumber !== confirmSltNumber) {
      return alert("SLT numbers do not match.");
    }

    if (!/^\d{10}$/.test(contactNumber)) {
      return alert("Contact Number must be exactly 10 digits.");
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      return alert("Amount must be a positive number.");
    }

    try {
      setLoading(true);
      const response = await sendSms("slt", {
        sltNumber,
        amount,
        contactNumber,
      });

      if (response?.status === "success") {
        setReplyMessage(response.fullMessage); // set reply to show below
      } else {
        setReplyMessage("SMS sent but no reply received.");
      }
    } catch (error) {
      setReplyMessage(error.message || "Failed to send SMS.");
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
            {/* SLT Form Inputs */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>SLT Number</Text>
              <TextInput
                style={styles.input}
                value={sltNumber}
                onChangeText={setSltNumber}
                placeholder="Enter mobile no or account no"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm SLT Number</Text>
              <TextInput
                style={styles.input}
                value={confirmSltNumber}
                onChangeText={setConfirmSltNumber}
                placeholder="Re-enter mobile no or account no"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (Rs)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="e.g., 1500"
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
                placeholder="e.g., 07XXXXXXXXX"
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

          {/* Show Reply Message as a Card */}
          {replyMessage && (
            <View style={localStyles.messageCard}>
              <Text style={localStyles.messageTitle}>Reply Message</Text>
              <Text style={localStyles.messageText}>{replyMessage}</Text>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SltsmsScreen;
