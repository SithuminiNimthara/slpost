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
  const [cameraRef, setCameraRef] = useState(null);

  const [type, setType] = useState(Camera?.Constants?.Type?.back || "back");

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log("Camera permission status:", status); // Log the status
      setHasPermission(status === "granted");
    };
    requestCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanning(false);
    // Ensure data is not empty before updating
    if (data) {
      updateFormField("barcodeNo", data);
    } else {
      Alert.alert("Error", "Invalid barcode scanned!");
    }
  };

  const updateFormField = (name, value) => {
    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      // Check if weight is a valid number before calculating postage
      if (name === "weight" || name === "companyType") {
        const weightValue = parseFloat(updatedData.weight);
        updatedData.postage = !isNaN(weightValue)
          ? updatedData.companyType === "government_department" &&
            weightValue === 30
            ? "150"
            : calculatePostage(weightValue).toFixed(2)
          : "";
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
      Alert.alert(
        "Error",
        `${missingField.replace(/([A-Z])/g, " $1")} is required!`
      );
      return;
    }

    try {
      console.log("Submitting Form:", formData);
      const response = await axios.post(
        "http://192.168.1.40:5000/api/acceptance/store",
        formData
      );

      if (response.status === 201) {
        Alert.alert("Success", "Form submitted successfully!");
        setFormData(initialFormState);
      } else {
        Alert.alert("Error", response.data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "Failed to submit form. Please try again.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }} // Ensures ScrollView grows with content
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
          />
        </View>

        <TouchableOpacity onPress={() => setScanning(true)}>
          <MaterialCommunityIcons name="qrcode-scan" size={30} color="black" />
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
