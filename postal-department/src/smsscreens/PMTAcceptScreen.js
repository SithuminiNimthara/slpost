import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { sendSms } from "../utils/sendEcounterSms";
import { getPinNo } from "../utils/getPinNo";

const PMTAccept = () => {
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [smsReply, setSmsReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!sender || !receiver || !amount) {
      setSmsReply("Please fill all the fields.");
      return;
    }

    setLoading(true);
    setSmsReply("");

    try {
      const pinNo = await getPinNo();
      const response = await sendSms({
        subType: "PMT_ACCEPT",
        pinNo,
        amount,
        RName: receiver,
        SName: sender,
      });

      if (response?.status === "success") {
        setSmsReply(response.fullMessage);
      } else {
        setSmsReply("SMS sent but no reply received.");
      }
    } catch (error) {
      setSmsReply(error.message || "Failed to send SMS.");
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
        <Text style={styles.label}>Sender Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter sender name"
          value={sender}
          onChangeText={setSender}
        />

        <Text style={styles.label}>Receiver Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter receiver name"
          value={receiver}
          onChangeText={setReceiver}
        />

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send SMS</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#9C1D1D" style={{ marginTop: 20 }} />}

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
    borderRadius: 8,
    backgroundColor: "#F2F2F2",
    borderColor: "#9C1D1D",
    borderWidth: 1,
  },
  replyLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9C1D1D",
    marginBottom: 5,
  },
  replyText: {
    fontSize: 16,
    color: "#333",
  },
});

export default PMTAccept;
