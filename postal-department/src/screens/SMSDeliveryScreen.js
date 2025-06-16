import React, { useState } from "react";
import { View, TouchableOpacity, Alert, TextInput, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { sendSms, requestSmsPermission } from "../utils/sendSms";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import styles from "../styles/smsdeliveryStyles";

const SMSDelivery = ({ username, locationName }) => {
  const [formData, setFormData] = useState({ barcodeNo: "" });
  const [scanning, setScanning] = useState(false);
  const [smsReply, setSmsReply] = useState(null); // Store SMS reply

  const handleSubmit = async () => {
    if (!formData.barcodeNo) {
      Alert.alert("Error", "Barcode number is required!");
      return;
    }

    try {
      const hasPermission = await requestSmsPermission();
      if (!hasPermission) {
        Alert.alert("Permission Denied", "SMS permission is required.");
        return;
      }

      const response = await sendSms("slpd", {
        barcode: formData.barcodeNo.trim().toUpperCase(),
        username,
        locationName,
      });

      console.log("SMS Delivery Response:", response);

      setSmsReply(response?.fullMessage || "No message received.");

      if (response && response.status === "success") {
        Alert.alert("Success", "SMS sent. Reply received below.");
        setFormData({ barcodeNo: "" });
      } else {
        Alert.alert("Failed", "SMS was not sent successfully.");
      }
    } catch (error) {
      console.error("Delivery Error:", error);
      Alert.alert("Error", "Delivery SMS failed to send.");
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
      Alert.alert(
        "Invalid Scan",
        "The scanned barcode is invalid. Please try again."
      );
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

      {/* Display SMS Reply */}
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
