import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculatePostage } from "../utils/calculatePostage";
import FormInput from "../components/FormInput";
import DropdownInput from "../components/DropdownInput";
import styles from "../styles/acceptanceFormStyles";
import BarcodeScannerModal from "../components/BarcodeScannerModal";

const formFields = [
  { label: "Sender Name", name: "sender_name" },
  { label: "Sender Mobile No", name: "contact_no" },
  { label: "Receiver Name", name: "receiver_name" },
  { label: "Address 1", name: "address_l1" },
  { label: "Address 2", name: "address_l2" },
  { label: "City 1", name: "city_1" },
  { label: "City 2", name: "city_2" },
];

const initialFormState = {
  sender_name: "",
  receiver_name: "",
  contact_no: "",
  address_l1: "",
  address_l2: "",
  city_1: "",
  city_2: "",
  company_type: "Normal",
  weight: "",
  amount: "",
  barcode: "",
};

const AcceptanceForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [userId, setUserId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [barcodeError, setBarcodeError] = useState("");
  const [weightError, setWeightError] = useState("");

  // Add this missing function for updating form fields
  const updateFormField = (name, value) => {
    if (name === "contact_no") {
      value = value.replace(/\D/g, "").slice(0, 10); // max 10 digits
    }

    if (name === "barcode") {
      value = value.toUpperCase().slice(0, 13);

      // live validation
      const isValid = /^[A-Z]{2}\d{9}LK$/.test(value);
      if (!isValid && value.length === 13) {
        setBarcodeError(
          "Barcode must be 13 characters: 2 letters + 9 digits + 'LK'."
        );
      } else {
        setBarcodeError(""); // Clear if valid or incomplete
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.User_id || "");
        setLocationId(user.Location_id || user.Location || "");
      }
    };

    requestCameraPermission();
    loadUser();
  }, []);

  useEffect(() => {
    const calculateAmount = () => {
      const weightNum = parseFloat(formData.weight);

      // Do nothing if weight is not a number or is zero/negative
      if (isNaN(weightNum) || weightNum <= 0) {
        setFormData((prev) => ({ ...prev, amount: "" }));
        setWeightError(""); // Clear any previous error
        return;
      }

      // Show error if weight exceeds 40000
      if (weightNum > 40000) {
        setFormData((prev) => ({ ...prev, amount: "" }));
        setWeightError("Weight cannot exceed 40000 grams.");
        return;
      }

      // Valid weight
      const amount = calculatePostage(weightNum, formData.company_type);
      if (amount !== null) {
        setFormData((prev) => ({ ...prev, amount: amount.toFixed(2) }));
        setWeightError(""); // Clear any previous error
      }
    };

    calculateAmount();
  }, [formData.weight, formData.company_type]);

  const formatFieldName = (field) =>
    field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const handleBarCodeScanned = (data) => {
    if (!scanning) return;
    setScanning(false);

    const trimmedData = data?.trim();
    if (trimmedData) {
      const isValidBarcode = /^[A-Z]{2}\d{9}LK$/.test(
        trimmedData.toUpperCase()
      );
      if (!isValidBarcode) {
        setBarcodeError(
          "Scanned barcode must be 13 characters: 2 letters + 9 digits + 'LK'."
        );
        return;
      }

      updateFormField("barcode", trimmedData);
      setBarcodeError(""); // Clear previous error
    } else {
      setBarcodeError("The scanned barcode is invalid. Please try again.");
    }
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "sender_name",
      "receiver_name",
      "contact_no",
      "company_type",
      "weight",
      "amount",
      "barcode",
    ];

    const missingField = requiredFields.find((field) => !formData[field]);
    if (missingField) {
      Alert.alert(
        "Missing Field",
        `${
          missingField.charAt(0).toUpperCase() +
          missingField.slice(1).replace(/_/g, " ")
        } is required.`
      );
      return;
    }

    // ✅ Barcode validation happens here
    const barcode = formData.barcode.trim().toUpperCase();
    const isValidBarcode = /^[A-Z]{2}\d{9}LK$/.test(barcode);
    if (!isValidBarcode) {
      Alert.alert(
        "Invalid Barcode",
        "Barcode must be 13 characters: 2 letters + 9 digits + 'LK'."
      );
      return;
    }

    if (!userId || !locationId) {
      Alert.alert(
        "Error",
        "User ID or Location ID not found. Please log in again."
      );
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: userId,
        office_id: locationId,
        ...formData,
        barcode,
      };

      const response = await axios.post(
        "https://ec.slpost.gov.lk/slpmail/forwardAccept.php",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 && response.data?.Status === "Success") {
        const {
          ReceiptNumber,
          Barcode,
          Passcode,
          Weight,
          "Amount Rs.": AmountRs,
        } = response.data;

        Alert.alert(
          "Form Submitted Successfully",
          `Receipt No: ${ReceiptNumber}\nBarcode: ${Barcode}\nPasscode: ${Passcode}\nWeight: ${Weight}g\nAmount: Rs. ${AmountRs}`
        );

        setFormData(initialFormState);
      } else if (
        response.data?.Status === "Error" &&
        response.data?.Error === "Barcode Already Exists"
      ) {
        Alert.alert(
          "Duplicate Barcode",
          "This barcode already exists in the system."
        );
      } else {
        Alert.alert("Error", response.data?.message || "Submission failed.");
        console.error("Form submission failed. Response:", response.data);
      }
    } catch (error) {
      console.error("Submission Error:", {
        message: error.message,
        data: error.response?.data,
      });

      if (error.response?.data?.message) {
        Alert.alert("Submission Error", error.response.data.message);
      } else if (error.message.includes("Network Error")) {
        Alert.alert("Network Error", "Please check your internet connection.");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateBarcode = (value) => {
    const trimmed = value.trim().toUpperCase();
    const isValid = /^[A-Z]{2}\d{9}LK$/.test(trimmed);

    if (!isValid) {
      setBarcodeError(
        "Barcode must be 13 characters: 2 letters + 9 digits + 'LK'."
      );
    } else {
      setBarcodeError(""); // Clear the error
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 50 }}
      >
        {formFields.map(({ label, name }) => (
          <FormInput
            key={name}
            label={label}
            name={name}
            value={formData[name]}
            onChange={updateFormField}
            keyboardType={name === "contact_no" ? "numeric" : "default"}
            required={
              name === "sender_name" ||
              name === "receiver_name" ||
              name === "contact_no"
            }
            placeholder={name === "contact_no" ? "e.g., 0712345678" : ""}
          />
        ))}

        <DropdownInput
          name="company_type"
          value={formData.company_type}
          onChange={updateFormField}
          required={true}
        />

        <FormInput
          label="Weight (grams)"
          name="weight"
          value={formData.weight}
          onChange={updateFormField}
          keyboardType="numeric"
          required={true}
          errorMessage={weightError}
        />

        <FormInput
          label="Postage (Rs)"
          name="amount"
          value={formData.amount}
          required={true}
          readOnly
        />

        <View style={styles.barcodeContainer}>
          <View style={{ flex: 1, marginRight: 20 }}>
            <FormInput
              label="Barcode No"
              name="barcode"
              value={formData.barcode}
              onChange={updateFormField}
              keyboardType="default"
              onBlur={() => validateBarcode(formData.barcode)}
              errorMessage={barcodeError}
              required={true}
              placeholder="e.g., XX123456789LK"
            />
          </View>

          <TouchableOpacity onPress={() => setScanning(true)}>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Store</Text>
          )}
        </TouchableOpacity>

        <BarcodeScannerModal
          visible={scanning}
          onClose={() => setScanning(false)}
          onScan={handleBarCodeScanned}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AcceptanceForm;
