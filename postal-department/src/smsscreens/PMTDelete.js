import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { sendSms } from "../utils/sendEcounterSms";
import { getPinNo } from "../utils/getPinNo";

const PMTDelete = () => {
  const [pmtNo, setPmtNo] = useState("");
  const [reason, setReason] = useState("");
  const [smsReply, setSmsReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!pmtNo || !reason) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setSmsReply("");

      const pinNo = await getPinNo();
      const response = await sendSms({
        subType: "PMT_DELETE",
        pinNo,
        PMTNo: pmtNo,
        reason,
      });

      if (response?.status === "success") {
        setSmsReply(response.fullMessage || "SMS sent successfully.");
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
        <Text style={styles.title}>Delete PMT</Text>

        <Text style={styles.label}>PMT No</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter PMT number"
          value={pmtNo}
          onChangeText={setPmtNo}
        />

        <Text style={styles.label}>Reason</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={reason}
            onValueChange={(itemValue) => setReason(itemValue)}
          >
            <Picker.Item label="Select Reason" value="" />
            <Picker.Item label="Invalid Payee" value="Invalid Payee" />
            <Picker.Item label="Valid Payee" value="Valid Payee" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleDelete}>
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
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
    marginTop: 25,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#F2F2F2",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  replyLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  replyText: {
    fontSize: 15,
    color: "#444",
  },
});

export default PMTDelete;
