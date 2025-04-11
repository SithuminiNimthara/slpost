import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Camera } from "expo-camera";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FormInput from "../components/FormInput";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import styles from "../styles/smsacceptanceStyles";
import { sendSms } from "../utils/sendSms";

const SMSAcceptanceForm = () => {
  const initialFormState = {
    receiverName: "",
    weight: "",
    amount: "",
    barcodeNo: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    requestCameraPermission();
  }, []);

  const handleBarCodeScanned = (data) => {
    console.log("SCANNED IN ACCEPTANCE FORM:", data); // Log the scanned data
    if (!scanning) return; // If scanning is not active, return early
    setScanning(false); // Close the scanner modal after scan

    const trimmedData = data?.trim(); // Trim any excess whitespace from scanned data
    if (trimmedData) {
      updateFormField("barcodeNo", trimmedData); // Update the barcode field
      Alert.alert("Success", "Barcode scanned successfully."); // Success alert
    } else {
      Alert.alert(
        "Invalid Scan",
        "The scanned barcode is invalid. Please try again." // Error alert
      );
    }
  };

  const updateFormField = (name, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "weight") {
        const weight = parseFloat(value);
        if (!isNaN(weight)) {
          let calculatedAmount = 0;
          if (weight <= 100) {
            calculatedAmount = weight * 2;
          } else if (weight <= 500) {
            calculatedAmount = weight * 1.8;
          } else if (weight <= 1000) {
            calculatedAmount = weight * 1.5;
          } else {
            calculatedAmount = weight * 1.2;
          }
          updatedData.amount = calculatedAmount.toFixed(2);
        }
      }
      return updatedData;
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.barcodeNo ||
      !formData.receiverName ||
      !formData.weight ||
      !formData.amount
    ) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    await sendSms(
      formData.barcodeNo,
      formData.receiverName,
      formData.weight,
      formData.amount
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>SMS Acceptance Form</Text>

      <View style={styles.barcodeContainer}>
        <View style={{ flex: 1, marginRight: 20 }}>
          <FormInput
            label="Barcode No"
            name="barcodeNo"
            value={formData.barcodeNo.toUpperCase()}
            onChange={updateFormField}
          />
        </View>

        <TouchableOpacity onPress={() => setScanning(true)}>
          <MaterialCommunityIcons name="barcode-scan" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <FormInput
        label="Receiver Name"
        name="receiverName"
        value={formData.receiverName}
        onChange={updateFormField}
      />

      <FormInput
        label="Weight (grams)"
        name="weight"
        value={formData.weight}
        onChange={updateFormField}
        keyboardType="numeric"
      />

      <FormInput
        label="Amount (Rs)"
        name="amount"
        value={formData.amount}
        onChange={updateFormField}
        keyboardType="numeric"
        editable={false}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send SMS</Text>
      </TouchableOpacity>

      <BarcodeScannerModal
        visible={scanning}
        onClose={() => setScanning(false)}
        onScan={handleBarCodeScanned}
      />
    </ScrollView>
  );
};

export default SMSAcceptanceForm;
