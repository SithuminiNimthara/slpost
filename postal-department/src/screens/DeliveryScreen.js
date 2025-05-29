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

const DeliveryScreen = () => {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodes, setBarcodes] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [userId, setUserId] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const inputRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.User_id || "");
        setUserLocation(user.Location || user.Location_id || "");
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

    try {
      const stored = await loadBarcodes();
      const updated = stored.map((b) =>
        barcodes.some((item) => item.value === b.value)
          ? { ...b, status: "delivered" }
          : b
      );
      await storeBarcodes(updated);
      setBarcodes([]);
      setBarcodeInput("");
      Alert.alert("Success", "Delivery details sent successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to send delivery details.");
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
