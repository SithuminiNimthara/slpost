import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Camera } from "expo-camera";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { calculatePostage } from "../utils/calculatePostage";
import FormInput from "../components/FormInput";
import DropdownInput from "../components/DropdownInput";
import styles from "../styles/acceptanceFormStyles";
import BarcodeScannerModal from "../components/BarcodeScannerModal";

const AcceptanceForm = () => {
  const initialFormState = {
    senderName: "",
    receiverName: "",
    address1: "",
    address2: "",
    city1: "",
    city2: "",
    companyType: "Normal",
    weight: "",
    postage: "",
    barcodeNo: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log("Camera permission status:", status);
      setHasPermission(status === "granted");
    };
    requestCameraPermission();
  }, []);

  const formatFieldName = (field) =>
    field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const handleBarCodeScanned = (data) => {
    if (!scanning) return;

    const trimmedData = data?.trim();
    if (trimmedData) {
      updateFormField("barcodeNo", trimmedData);
      Alert.alert("Success", "Barcode scanned successfully.");
    } else {
      Alert.alert("Invalid Scan", "The scanned barcode is invalid. Please try again.");
    }

    setScanning(false); // Close the scanner after handling
  };

  const updateFormField = (name, value) => {
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      if (name === "weight" || name === "companyType") {
        const weightValue = parseFloat(updatedData.weight);
        const companyType = updatedData.companyType;

        const postageAmount =
          !isNaN(weightValue) && weightValue > 0
            ? calculatePostage(weightValue, companyType)
            : null;

        updatedData.postage =
          postageAmount !== null ? postageAmount.toFixed(2) : "";
      }

      return updatedData;
    });
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "senderName",
      "receiverName",
      "address1",
      "city1",
      "address2",
      "city2",
      "companyType",
      "weight",
      "postage",
      "barcodeNo",
    ];

    const missingField = requiredFields.find((field) => !formData[field]);
    if (missingField) {
      Alert.alert("Missing Field", `${formatFieldName(missingField)} is required.`);
      return;
    }

    try {
      console.log("Submitting Form:", formData);

      const response = await axios.post(
        "https://slpmail.slpost.gov.lk/appapi/appaccept.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data?.success) {
        Alert.alert("Success", "Form submitted successfully!");
        setFormData(initialFormState);
      } else {
        Alert.alert("Error", response.data?.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response?.data?.message) {
        Alert.alert("Submission Error", error.response.data.message);
      } else if (error.message.includes("Network Error")) {
        Alert.alert("Network Error", "Please check your internet connection.");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
    >
      {[
        { label: "Sender Name", name: "senderName" },
        { label: "Receiver Name", name: "receiverName" },
        { label: "Address 1", name: "address1" },
        { label: "City 1", name: "city1" },
        { label: "Address 2", name: "address2" },
        { label: "City 2", name: "city2" },
      ].map(({ label, name }) => (
        <FormInput
          key={name}
          label={label}
          name={name}
          value={formData[name]}
          onChange={updateFormField}
        />
      ))}

      <DropdownInput
        name="companyType"
        value={formData.companyType}
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
        label="Postage (Rs)"
        name="postage"
        value={formData.postage}
        readOnly
      />

      <View style={styles.barcodeContainer}>
        <View style={{ flex: 1, marginRight: 20 }}>
          <FormInput
            label="Barcode No"
            name="barcodeNo"
            value={formData.barcodeNo}
            onChange={updateFormField}
            keyboardType="default"
          />
        </View>

        <TouchableOpacity onPress={() => setScanning(true)}>
          <MaterialCommunityIcons name="barcode-scan" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Store</Text>
      </TouchableOpacity>

      <BarcodeScannerModal
        visible={scanning}
        onClose={() => setScanning(false)}
        onScan={handleBarCodeScanned}
      />
    </ScrollView>
  );
};

export default AcceptanceForm;
