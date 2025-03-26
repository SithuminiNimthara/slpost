import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Camera } from "expo-camera";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FormInput from "../components/FormInput";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import styles from "../styles/smsacceptanceStyles";
import { sendSms } from "../utils/sendSms"; // Import SMS function

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

  const handleBarCodeScanned = ({ type, data }) => {
    setScanning(false);
    if (data) {
      setFormData((prevData) => ({ ...prevData, barcodeNo: data }));
    } else {
      Alert.alert("Error", "Invalid barcode scanned!");
    }
  };

  const updateFormField = (name, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Automatically calculate amount when weight changes
      if (name === "weight") {
        const weight = parseFloat(value);
        if (!isNaN(weight)) {
          let calculatedAmount = 0;

          // Define the price ranges based on weight
          if (weight <= 100) {
            calculatedAmount = weight * 2; // Price per gram for 0-100g
          } else if (weight <= 500) {
            calculatedAmount = weight * 1.8; // Price per gram for 101-500g
          } else if (weight <= 1000) {
            calculatedAmount = weight * 1.5; // Price per gram for 501-1000g
          } else {
            calculatedAmount = weight * 1.2; // Price per gram for 1001g and above
          }

          updatedData.amount = calculatedAmount.toFixed(2); // Set the amount
        }
      }

      return updatedData;
    });
  };

  const handleSendSms = async () => {
    const { receiverName, weight, amount, barcodeNo } = formData;

    if (!receiverName || !weight || !amount || !barcodeNo) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    // Ensure weight and amount are numbers
    if (isNaN(weight) || isNaN(amount)) {
      Alert.alert("Error", "Weight and Amount must be numeric!");
      return;
    }

    // Send SMS using the defined function
    await sendSms(barcodeNo, receiverName, weight, amount);
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
            value={formData.barcodeNo.toUpperCase()} // Display in uppercase
            onChange={updateFormField}
          />
        </View>

        <TouchableOpacity onPress={() => setScanning(true)}>
          <MaterialCommunityIcons name="qrcode-scan" size={30} color="black" />
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
        editable={false} // Prevent manual editing of amount
      />

      <TouchableOpacity style={styles.button} onPress={handleSendSms}>
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
