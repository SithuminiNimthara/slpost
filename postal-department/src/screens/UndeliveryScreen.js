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
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import {
  loadBarcodes,
  storeBarcodes,
  storeUndeliveryBarcodes,
  loadUndeliveryBarcodes,
  clearUndeliveryBarcodes,
} from "../utils/barcodeStorage";
import styles from "../styles/undeliveryStyles";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

const ATTEMPT_REASONS = [
  { label: "Door closed", value: "7" },
  { label: "Not at this address", value: "8" },
  { label: "Incorrect address", value: "9" },
  { label: "Return to sender", value: "10" },
  { label: "Return to RLO", value: "11" },
];

const UndeliveryScreen = () => {
  const navigation = useNavigation();
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodes, setBarcodes] = useState([]);
  const [allBarcodes, setAllBarcodes] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [userId, setUserId] = useState("");
  const [officeId, setOfficeId] = useState("");
  const [reasonId, setReasonId] = useState("");
  const inputRef = useRef(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const init = async () => {
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.User_id || "");
        setOfficeId(user.Location_id || user.office_id || "");
      }

      const deliveryStored = await loadBarcodes();
      const undeliveredStored = await loadUndeliveryBarcodes();

      setAllBarcodes(deliveryStored || []);
      setBarcodes(undeliveredStored || []);
    };
    init();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const deliveryStored = await loadBarcodes();
      const undeliveredStored = await loadUndeliveryBarcodes();

      setAllBarcodes(deliveryStored || []);
      setBarcodes(undeliveredStored || []);
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    storeUndeliveryBarcodes(barcodes);
  }, [barcodes]);

  const validateAndAddBarcode = (code) => {
    const barcode = code.trim().toUpperCase();
    if (!barcode) return;

    if (barcodes.some((b) => b.value === barcode)) {
      Alert.alert(
        "Duplicate",
        "This barcode is already in the undelivered list."
      );
      return;
    }

    setBarcodes((prev) => [...prev, { value: barcode }]);
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

  const handleRemove = (index) => {
    const updated = [...barcodes];
    updated.splice(index, 1);
    setBarcodes(updated);
  };

  const handleSend = async () => {
    if (barcodes.length === 0) {
      Alert.alert("Error", "Add at least one barcode to send.");
      return;
    }
    if (!reasonId) {
      Alert.alert("Error", "Please select a reason for undelivery.");
      return;
    }
    if (!userId || !officeId) {
      Alert.alert("Error", "User or office ID missing.");
      return;
    }

    try {
      const payload = {
        barcode: barcodes.map((b) => b.value),
        user_id: userId,
        office_id: officeId,
        attempt: reasonId,
      };

      const rawResponse = await axios.post(
        "https://ec.slpost.gov.lk/slpmail/forwardUndelivery.php",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
          responseType: "text", // get raw response
        }
      );

      console.log("Full Response:", rawResponse.data);
      const cleaned = rawResponse.data.replace(/^\d+/, ""); // remove number prefix
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.error("JSON parse error:", err);
        Alert.alert("Error", "Invalid server response.");
        return;
      }

      const results = Array.isArray(parsed?.Results) ? parsed.Results : [];

      if (results.length === 0) {
        Alert.alert(
          "No Results",
          "Server responded but returned no result messages."
        );
        return;
      }

      // Show all results (Success/Error/Warning) per barcode
      const messages = results
        .map((res) => `${res.barcode}: ${res.message}`)
        .join("\n");
      Alert.alert(parsed.Status || "Result", messages);

      // Only update and clear if no errors
      const hasError = results.some((r) => r.status === "Error");
      if (!hasError) {
        const undeliveredBarcodes = barcodes.map((b) => b.value);
        const updatedDelivery = allBarcodes.map((b) =>
          undeliveredBarcodes.includes(b.value)
            ? { ...b, status: "undelivered", reasonId }
            : b
        );
        await storeBarcodes(updatedDelivery);
        await clearUndeliveryBarcodes();
        setBarcodes([]);
        setReasonId("");
      }
    } catch (error) {
      console.error("API call failed:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send undelivery details."
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

      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>Reason for undelivery</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={reasonId}
            onValueChange={setReasonId}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Reason --" value="" />
            {ATTEMPT_REASONS.map((reason) => (
              <Picker.Item
                key={reason.value}
                label={reason.label}
                value={reason.value}
              />
            ))}
          </Picker>
        </View>
      </View>

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

export default UndeliveryScreen;
