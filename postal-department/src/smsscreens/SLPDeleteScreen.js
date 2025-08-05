import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import BarcodeInput from "../components/BarcodeInput";
import { sendSms } from "../utils/sendSLPMailSms"; // Make sure this supports delete action

const SmsDeleteScreen = () => {
  const [barcode, setBarcode] = useState("");
  const [messages, setMessages] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  const parseDeleteSms = (smsText) => {
    return {
      fullMessage: smsText,
    };
  };

  const handleSendDeleteRequest = async () => {
    const trimmedBarcode = barcode.trim().toUpperCase();

    if (!trimmedBarcode) {
      Alert.alert("Input Error", "Please enter or scan a barcode.");
      return;
    }

    setLoading(true);

    try {
      const response = await sendSms("slpe", {
        barcode: trimmedBarcode,
      });

      if (response && response.fullMessage) {
        const parsedData = parseDeleteSms(response.fullMessage);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: "received",
            data: parsedData,
            timestamp: new Date().toLocaleString(),
          },
        ]);
      } else {
        Alert.alert("No Response", "Could not parse delete confirmation.");
      }
    } catch (error) {
      console.error("Delete Error:", error.message);
      Alert.alert("Error", error.message || "Failed to send delete request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BarcodeInput
        barcode={barcode}
        setBarcode={setBarcode}
        onScan={() => setScanning(true)}
        onTrack={handleSendDeleteRequest}
        buttonLabel="Delete"
      />

      {loading && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#9C1D1D" />
          <Text style={styles.loadingText}>
            Waiting for SMS confirmation...
          </Text>
        </View>
      )}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageCard}>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
            <Text style={styles.fullMessage}>{item.data.fullMessage}</Text>
          </View>
        )}
      />

      <BarcodeScannerModal
        visible={scanning}
        onClose={() => setScanning(false)}
        onScan={(data) => {
          setBarcode(data);
          setScanning(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  messageCard: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: "#FDECEA",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#f5c6cb",
  },
  timestamp: {
    fontSize: 12,
    color: "#9C1D1D",
    marginBottom: 5,
  },
  fullMessage: {
    marginTop: 10,
    fontSize: 18,
    color: "#9C1D1D",
  },
  spinnerContainer: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SmsDeleteScreen;
