import React, { useState } from "react";
import { View, TouchableOpacity, Alert, TextInput, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { sendSms } from "../utils/sendSms"; // Import updated function
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import styles from "../styles/smsdeliveryStyles";

const SMSDelivery = () => {
  const [formData, setFormData] = useState({
    barcodeNo: "", // Only barcodeNo is required
  });

  const [scanning, setScanning] = useState(false); // Controls barcode scanner modal visibility

  const handleSubmit = () => {
    if (!formData.barcodeNo) {
      Alert.alert("Error", "Barcode number is required!");
      return;
    }

    // Format message with barcode number only
    const fullMessage = `pec slpa\nBarcode No: ${formData.barcodeNo}`;

    // Send SMS to 1919
    sendSms(fullMessage);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanning(false);
    if (data) {
      setFormData((prevData) => ({ ...prevData, barcodeNo: data }));
    } else {
      Alert.alert("Error", "Invalid barcode scanned!");
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
          <MaterialCommunityIcons name="qrcode-scan" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        visible={scanning}
        onClose={() => setScanning(false)}
        onScan={handleBarCodeScanned}
      />
    </View>
  );
};

export default SMSDelivery;
