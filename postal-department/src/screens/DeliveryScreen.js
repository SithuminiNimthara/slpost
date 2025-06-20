import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Keyboard,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FontAwesome } from "@expo/vector-icons";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeBarcodes, loadBarcodes } from "../utils/barcodeStorage";
import styles from "../styles/deliveryStyles";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

// Set the attempt code as needed (4 for delivered, 7 for undelivered, etc.)
const DELIVERY_ATTEMPT_CODE = "4";

const DeliveryScreen = () => {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodes, setBarcodes] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [userId, setUserId] = useState("");
  const [officeId, setOfficeId] = useState("");
  const inputRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.User_id || "");
        setOfficeId(user.Location_id || user.office_id || user.Location || "");
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refreshBarcodes();
    });
    return unsubscribe;
  }, [navigation]);

  const refreshBarcodes = async () => {
    const stored = await loadBarcodes();
    setBarcodes(stored.filter((b) => b.status === "pending"));
  };

  const validateAndAddBarcode = async (code) => {
    const barcode = code.trim().toUpperCase();
    if (!barcode) return;

    if (barcodes.some((b) => b.value === barcode)) {
      Alert.alert("Duplicate", "This barcode is already in the list.");
      return;
    }

    const newBarcode = { value: barcode, status: "pending" };
    const updatedBarcodes = [...barcodes, newBarcode];
    setBarcodes(updatedBarcodes);

    const existing = await loadBarcodes();
    const updatedStorage = [...existing, newBarcode];
    await storeBarcodes(updatedStorage);

    setBarcodeInput("");
    Keyboard.dismiss();
  };

  const handleAddBarcode = () => {
    validateAndAddBarcode(barcodeInput);
  };

  const handleScan = (data) => {
    setScanning(false);
    if (data) {
      validateAndAddBarcode(data);
    }
  };

  const handleRemove = async (index) => {
    const removedBarcode = barcodes[index].value;
    const updated = [...barcodes];
    updated.splice(index, 1);
    setBarcodes(updated);

    const stored = await loadBarcodes();
    const newStored = stored.filter((b) => b.value !== removedBarcode);
    await storeBarcodes(newStored);
  };

  const handleSend = async () => {
    if (barcodes.length === 0) {
      Alert.alert("Error", "Add at least one barcode to send.");
      return;
    }
    if (!userId || !officeId) {
      Alert.alert("Error", "User or office ID missing.");
      return;
    }

    try {
      // Prepare payload for API
      const payload = {
        barcode: barcodes.map((b) => b.value),
        user_id: userId,
        office_id: officeId,
        attempt: DELIVERY_ATTEMPT_CODE,
      };

      // Send POST request to the API
      const response = await axios.post(
        "https://ec.slpost.gov.lk/slpmail/forwardDelivery.php",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      // Handle API response
      if (response.data && response.data.Status === "Processed") {
        // Show warnings or success for each barcode
        const results = response.data.Results || [];
        let warningMessages = results
          .filter((r) => r.status !== "Success")
          .map((r) => `${r.barcode}: ${r.message}`)
          .join("\n");

        let successMessages = results
          .filter((r) => r.status === "Success")
          .map((r) => `${r.barcode}: Delivered`)
          .join("\n");

        if (successMessages) {
          Alert.alert("Success", `Delivered:\n${successMessages}`);
        }
        if (warningMessages) {
          Alert.alert("Warning", warningMessages);
        }

        // Update local storage to mark as delivered
        const stored = await loadBarcodes();
        const updated = stored.map((b) =>
          barcodes.some((item) => item.value === b.value)
            ? { ...b, status: "delivered" }
            : b
        );
        await storeBarcodes(updated);
        setBarcodes([]);
        setBarcodeInput("");
      } else {
        Alert.alert(
          "Error",
          response.data?.message || "Failed to send delivery details."
        );
      }
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send delivery details."
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Barcode"
          value={barcodeInput}
          onChangeText={setBarcodeInput}
          returnKeyType="done"
          onSubmitEditing={handleAddBarcode}
        />
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setScanning(true)}
        >
          <MaterialCommunityIcons name="barcode-scan" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButtonSmall}
          onPress={handleAddBarcode}
        >
          <Text style={styles.addButtonTextSmall}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={barcodes}
        keyExtractor={(item, idx) => item.value + idx}
        style={{ marginBottom: 20 }}
        renderItem={({ item, index }) => (
          <View style={styles.listRow}>
            <Text style={styles.listText}>
              {index + 1}. {item.value}
            </Text>
            <TouchableOpacity
              onPress={() => handleRemove(index)}
              style={styles.checkbox}
            >
              <FontAwesome name="trash" size={18} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No barcodes added.</Text>
        }
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>

      <BarcodeScannerModal
        visible={scanning}
        onClose={() => setScanning(false)}
        onScan={handleScan}
      />
    </View>
  );
};

export default DeliveryScreen;
