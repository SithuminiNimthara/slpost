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
import { sendSms } from "../utils/sendSms";

const SmsTrackingScreen = () => {
  const [barcode, setBarcode] = useState("");
  const [messages, setMessages] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);

  // Parse the SMS reply text to extract useful info
  const parseTrackingSms = (smsText) => {
    return {
      fullMessage: smsText,
    };
  };

  const handleSendTrackingRequest = async () => {
    if (!barcode) {
      Alert.alert("Error", "Please enter or scan a barcode");
      return;
    }

    setLoading(true);

    try {
      const trackingSms = await sendSms("slpt", {
        barcode: barcode.toUpperCase(),
      });

      if (trackingSms && trackingSms.fullMessage) {
        const parsedData = parseTrackingSms(trackingSms.fullMessage);

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
        Alert.alert("No Response", "Could not parse tracking response.");
      }
    } catch (error) {
      console.error("Tracking Error:", error.message);
      Alert.alert(
        "Error",
        error.message || "Failed to get tracking information."
      );
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
        onTrack={handleSendTrackingRequest}
      />

      {loading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ marginTop: 10 }}
        />
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
    backgroundColor: "#e3f2fd",
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  timestamp: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5,
  },
  fullMessage: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
});

export default SmsTrackingScreen;
