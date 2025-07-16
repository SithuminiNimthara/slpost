import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FormInput from "../components/FormInput";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import styles from "../styles/smsacceptanceStyles";
import { sendSms } from "../utils/sendSLPMailSms";
import { calculatePostage } from "../utils/calculatePostage";

const isValidPhoneNumber = (number) => /^[0-9]{10}$/.test(number);

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
    barcodeNo: "",
    receiverName: "",
    contact_no: "",
    weight: "",
    amount: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [smsReply, setSmsReply] = useState(null);
  const [weightError, setWeightError] = useState("");
  const [loading, setLoading] = useState(false); // loading state for SMS send

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    requestCameraPermission();
  }, []);

  const updateFormField = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      setSmsReply(null); // clear reply on change

      if (name === "contact_no") {
        updated.contact_no = value.replace(/\D/g, "").slice(0, 10);
      }

      if (name === "weight") {
        const weight = parseFloat(value);
        if (isNaN(weight) || weight <= 0) {
          updated.amount = "";
          setWeightError("");
        } else if (weight > 40000) {
          updated.amount = "";
          setWeightError("Weight cannot exceed 40000 grams.");
        } else {
          updated.amount = calculatePostage(weight)?.toString() || "";
          setWeightError("");
        }
      }

      if (name === "barcodeNo") {
        let barcode = value.trim().toUpperCase();
        if (barcode.length > 13) {
          barcode = barcode.slice(0, 13);
        }
        updated.barcodeNo = barcode;
      }

      return updated;
    });
  };

  const handleBarCodeScanned = (data) => {
    if (!scanning) return;
    setScanning(false);
    setSmsReply(null);

    const trimmedData = data?.trim().toUpperCase().slice(0, 13);
    if (trimmedData) {
      updateFormField("barcodeNo", trimmedData);
    }
  };

  const handleSubmit = async () => {
    const { barcodeNo, receiverName, contact_no, weight, amount } = formData;
    const barcode = barcodeNo.trim().toUpperCase();

    // Basic validation
    if (!barcode || !receiverName || !contact_no || !weight || !amount) {
      alert("Please fill all required fields.");
      return;
    }

    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0 || parsedWeight > 40000) {
      setWeightError("Weight must be between 1 and 40000 grams.");
      return;
    }

    if (!isValidPhoneNumber(contact_no)) {
      alert("Invalid mobile number. Must be 10 digits.");
      return;
    }

    const granted = await requestSmsPermission();
    if (!granted) {
      alert("SMS permission is required.");
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      const response = await sendSms("slpa", {
        barcode,
        receiverName,
        contact_no,
        weight,
        amount,
      });

      if (response && response.fullMessage) {
        setSmsReply(response.fullMessage);
        setFormData(initialFormState);
      } else {
        setSmsReply("SMS delivery failed.");
      }
    } catch (err) {
      console.error("SMS Error:", err);
      setSmsReply("Something went wrong.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.barcodeContainer}>
        <View style={{ flex: 1, marginRight: 20 }}>
          <FormInput
            label="Barcode No"
            name="barcodeNo"
            value={formData.barcodeNo}
            onChange={updateFormField}
            placeholder="e.g., XX123456789LK"
            autoCapitalize="characters"
            required
            editable={!loading} // disable input while loading
          />
        </View>
        <TouchableOpacity
          onPress={() => !loading && setScanning(true)}
          disabled={loading} // disable scan button while loading
        >
          <MaterialCommunityIcons name="barcode-scan" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <FormInput
        label="Receiver Name"
        name="receiverName"
        value={formData.receiverName}
        onChange={updateFormField}
        autoCapitalize="words"
        required
        editable={!loading}
      />

      <FormInput
        label="Sender Mobile Number"
        name="contact_no"
        value={formData.contact_no}
        onChange={updateFormField}
        keyboardType="phone-pad"
        placeholder="e.g., 0712345678"
        required
        editable={!loading}
      />

      <FormInput
        label="Weight (grams)"
        name="weight"
        value={formData.weight}
        onChange={updateFormField}
        keyboardType="numeric"
        errorMessage={weightError}
        required
        editable={!loading}
      />

      <FormInput
        label="Amount (Rs)"
        name="amount"
        value={formData.amount}
        onChange={updateFormField}
        keyboardType="numeric"
        editable={false}
        required
      />

      <TouchableOpacity
        style={[
          styles.button,
          loading && {
            backgroundColor: "#9C1D1D",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send SMS</Text>
        )}
      </TouchableOpacity>

      {smsReply && !loading && (
        <View style={styles.replyContainer}>
          <Text style={styles.replyTitle}>Reply Message:</Text>
          {smsReply.split("\n").map((line, idx) => (
            <Text key={idx} style={styles.replyText}>
              {line.trim()}
            </Text>
          ))}
        </View>
      )}

      <BarcodeScannerModal
        visible={scanning}
        onClose={() => setScanning(false)}
        onScan={handleBarCodeScanned}
      />
    </ScrollView>
  );
};

export default SMSAcceptanceForm;
