import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { sendSms } from "../utils/sendEcounterSms";
import { getPinNo } from "../utils/getPinNo";

const PMTPayment = () => {
  const [pmtNo, setPmtNo] = useState("");
  const [nic, setNic] = useState("");
  const [smsReply, setSmsReply] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!pmtNo || !nic) {
      Alert.alert("Error", "Please fill out both fields.");
      return;
    }

    try {
      setLoading(true);
      setSmsReply(null); // Clear previous message
      const pinNo = await getPinNo();
      const response = await sendSms({
        subType: "PMT_PAYMENT",
        pinNo,
        PMTNo: pmtNo,
        NIC: nic,
      });

      if (response?.status === "success") {
        setSmsReply(response.fullMessage);
      } else {
        setSmsReply("SMS sent but no reply received.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send SMS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={styles.title}>PMT Payment</Text>

        <Text style={styles.label}>PMT No</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter PMT number"
          value={pmtNo}
          onChangeText={setPmtNo}
        />

        <Text style={styles.label}>NIC No</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter NIC number"
          value={nic}
          onChangeText={setNic}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {loading ? "Sending..." : "Send SMS"}
          </Text>
        </TouchableOpacity>

        {smsReply && !loading && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyLabel}>Reply Message:</Text>
            <Text style={styles.replyText}>{smsReply}</Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inner: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9C1D1D",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#9C1D1D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  replyContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
  replyLabel: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 16,
    color: "#333",
  },
  replyText: {
    fontSize: 15,
    color: "#555",
  },
});

export default PMTPayment;
