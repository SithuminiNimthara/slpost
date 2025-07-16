import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Text,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { sendSms } from "../utils/sendSLPMailSms";
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const barcode = formData.barcodeNo.trim().toUpperCase();

    if (!barcode) {
      Alert.alert("Error", "Barcode number is required!");
      return;
    }

    setLoading(true); // Start loading immediately

    try {
      const hasPermission = await requestSmsPermission();

      if (!hasPermission) {
        Alert.alert("Permission Denied", "SMS permission is required.");
        return;
      }

      const response = await sendSms("slpd", { barcode });

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
    } finally {
      setLoading(false); // Stop loading after finished
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
          autoCapitalize="characters"
          maxLength={13}
          editable={!loading} // disable input while loading
        />
        <TouchableOpacity onPress={() => !loading && setScanning(true)}>
          <MaterialCommunityIcons name="barcode-scan" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: "#9C1D1D" }]}
        onPress={handleSubmit}
        disabled={loading} // disable button while loading
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send SMS</Text>
        )}
      </TouchableOpacity>

      {smsReply && !loading && (
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
