import React, { useState } from "react";
import { View, TouchableOpacity, Alert, TextInput, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { sendSms } from "../utils/sendSms"; // Import the SMS function
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import styles from "../styles/smsdeliveryStyles";

const SMSDelivery = () => {
  const [formData, setFormData] = useState({ barcodeNo: "" });
  const [scanning, setScanning] = useState(false);

  const handleSubmit = async () => {
    if (!formData.barcodeNo) {
      Alert.alert("Error", "Barcode number is required!");
      return;
    }
    // Call the SMS function with the barcode number
    await sendSms("slpd", {
      barcode: formData.barcodeNo,
      username,
      locationName,
    });
  };

  const handleBarCodeScanned = (data) => {
    console.log("SCANNED IN DELIVERY FORM:", data); // Log the scanned data

    if (!scanning) return; // If scanning is not active, return early
    setScanning(false); // Close the scanner modal after scan

    const trimmedData = data?.trim(); // Trim any excess whitespace from scanned data

    if (trimmedData) {
      setFormData((prevData) => ({ ...prevData, barcodeNo: trimmedData })); // Update the barcode field
      Alert.alert("Success", "Barcode scanned successfully."); // Success alert
    } else {
      Alert.alert(
        "Invalid Scan",
        "The scanned barcode is invalid. Please try again."
      ); // Error alert
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

      <BarcodeScannerModal
        visible={scanning}
        onClose={() => setScanning(false)}
        onScan={handleBarCodeScanned}
      />
    </View>
  );
};

export default SMSDelivery;
