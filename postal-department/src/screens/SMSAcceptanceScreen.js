import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { Camera } from "expo-camera";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FormInput from "../components/FormInput";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import styles from "../styles/smsacceptanceStyles";
import { sendSms } from "../utils/sendSms";
import { calculatePostage } from "../utils/calculatePostage";

// Request SMS permission on Android
const requestSmsPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: "SMS Permission",
          message: "This app needs permission to send SMS messages.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn("Permission error:", err);
      return false;
    }
  }
  return true;
};

const SMSAcceptanceForm = ({ username, locationName }) => {
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
    if (!scanning) return;
    setScanning(false);

    const trimmedData = data?.trim();
    if (trimmedData) {
      updateFormField("barcodeNo", trimmedData);
      Alert.alert("Success", "Barcode scanned successfully.");
    } else {
      Alert.alert("Invalid Scan", "The scanned barcode is invalid.");
    }
  };

  const updateFormField = (name, value) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === "weight") {
        const weight = parseFloat(value);

        if (!isNaN(weight)) {
          if (weight > 40000) {
            Alert.alert("Error", "Maximum allowed weight is 40kg.");
            updatedData.amount = "";
          } else if (weight > 0) {
            const postage = calculatePostage(weight);
            updatedData.amount =
              postage && postage !== "Invalid weight" ? postage.toString() : "";
          } else {
            updatedData.amount = "";
          }
        } else {
          updatedData.amount = "";
        }
      }

      return updatedData;
    });
  };

  const handleSubmit = async () => {
    const weight = parseFloat(formData.weight);

    if (
      !formData.barcodeNo ||
      !formData.receiverName ||
      !formData.weight ||
      !formData.amount
    ) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (isNaN(weight) || weight <= 0 || weight > 40000) {
      Alert.alert("Error", "Weight must be between 1g and 40000g.");
      return;
    }

    const hasPermission = await requestSmsPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "SMS permission is required.");
      return;
    }
    try {
      const response = await sendSms("slpa", {
        barcode: formData.barcodeNo,
        receiverName: formData.receiverName,
        weight: formData.weight,
        amount: formData.amount,
        username,
        locationName,
      });

      if (response) {
        Alert.alert(
          "Success",
          response.fullMessage ||
            `${response.barcode} successfully accepted\nat ${response.location}`,
          [
            {
              text: "OK",
              onPress: () => setFormData(initialFormState),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send SMS details.");
    }
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
