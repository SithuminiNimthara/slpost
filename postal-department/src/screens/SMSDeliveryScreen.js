import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Text,
  PermissionsAndroid,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { sendSms } from "../utils/sendSms";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import styles from "../styles/smsdeliveryStyles";

// Permission function
const requestSmsPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      ]);

      return (
        granted["android.permission.SEND_SMS"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.RECEIVE_SMS"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted["android.permission.READ_SMS"] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.warn("Permission error:", err);
      return false;
    }
  }
  return true;
};

const SMSDelivery = ({ username, locationName }) => {
  const [formData, setFormData] = useState({ barcodeNo: "" });
  const [scanning, setScanning] = useState(false);
  const [smsReply, setSmsReply] = useState(null);

  const handleSubmit = async () => {
    const barcode = formData.barcodeNo.trim().toUpperCase();
    console.log("Submit pressed. Barcode:", barcode);

    // Validate barcode format
    if (!barcode) {
      Alert.alert("Error", "Barcode number is required!");
      return;
    }

    if (!/^[A-Z]{2}\d{9}LK$/.test(barcode)) {
      Alert.alert(
        "Invalid Barcode",
        "Barcode must be in format: 2 letters + 9 digits + LK"
      );
      return;
    }

    const hasPermission = await requestSmsPermission();
    console.log("SMS Permission granted:", hasPermission);

    if (!hasPermission) {
      Alert.alert("Permission Denied", "SMS permission is required.");
      return;
    }

    try {
      console.log("Calling sendSms with type 'slpd'...");
      const response = await sendSms("slpd", { barcode });

      console.log("SMS Delivery Response:", response);

      if (response && response.status === "success" && response.fullMessage) {
        setSmsReply(response.fullMessage);
        Alert.alert("Success", "SMS sent. Reply received.");
        setFormData({ barcodeNo: "" });
      } else {
        setSmsReply(response?.fullMessage || "No valid response received.");
        Alert.alert("Failed", "SMS was sent but reply is invalid.");
      }
    } catch (error) {
      console.error("Delivery Error:", error);
      if (error.message === "SMS response timeout") {
        setSmsReply("No response received within 90 seconds.");
        Alert.alert("Timeout", "No reply received within 90 seconds.");
      } else {
        Alert.alert("Error", "Delivery SMS failed to send.");
      }
    }
  };

  const handleBarCodeScanned = (data) => {
    if (!scanning) return;
    setScanning(false);

    const trimmedData = data?.trim();
    if (trimmedData) {
      setFormData((prev) => ({ ...prev, barcodeNo: trimmedData }));
      Alert.alert("Success", "Barcode scanned successfully.");
    } else {
      Alert.alert("Invalid Scan", "The scanned barcode is invalid.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.barcodeContainer}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 20 }]}
          placeholder="Enter barcode number"
          value={formData.barcodeNo}
          onChangeText={(text) => setFormData({ ...formData, barcodeNo: text })}
        />
        <TouchableOpacity onPress={() => setScanning(true)}>
          <MaterialCommunityIcons name="barcode-scan" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send SMS</Text>
      </TouchableOpacity>

      {smsReply && (
        <View style={styles.replyContainer}>
          <Text style={styles.replyLabel}>Reply Message:</Text>
          <Text style={styles.replyText}>{smsReply}</Text>
        </View>
      )}

      <BarcodeScannerModal
        visible={scanning}
        onClose={() => setScanning(false)}
        onScan={handleBarCodeScanned}
      />
    </View>
  );
};

export default SMSDelivery;
