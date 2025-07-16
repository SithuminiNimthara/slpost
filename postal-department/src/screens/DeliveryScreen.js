import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Keyboard,
  Modal,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FontAwesome } from "@expo/vector-icons";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeBarcodes, loadBarcodes } from "../utils/barcodeStorage";
import styles from "../styles/deliveryStyles";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

const ResultModal = ({ visible, results, onClose }) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Delivery Results</Text>
        <ScrollView style={styles.modalScroll}>
          {results.map((res, index) => (
            <Text
              key={index}
              style={[
                styles.modalItem,
                res.status === "Error" ? { color: "red" } : { color: "green" },
              ]}
            >
              {res.barcode}: {res.message}
            </Text>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
          <Text style={styles.modalCloseButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const DeliveryScreen = () => {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodes, setBarcodes] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [userId, setUserId] = useState("");
  const [officeId, setOfficeId] = useState("");
  const [postmanName, setPostmanName] = useState("");
  const [assignedBeatNumber, setAssignedBeatNumber] = useState(1);
  const [beats, setbeats] = useState("");
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [resultMessages, setResultMessages] = useState([]);
  const inputRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.User_id || "");
        setOfficeId(user.Location_id || user.office_id || user.Location || "");
        const beatCount = parseInt(user.beats) || 1;
        setAssignedBeatNumber(beatCount);
        if (beatCount === 1) setbeats("1");
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

  const addBarcode = async (code) => {
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
    addBarcode(barcodeInput);
  };

  const handleScan = (data) => {
    setScanning(false);
    if (data) {
      addBarcode(data);
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
    if (!postmanName.trim()) {
      Alert.alert("Error", "Please enter the postman name.");
      return;
    }
    if (!beats) {
      Alert.alert("Error", "Please select a beat number.");
      return;
    }

    const payload = {
      barcode: barcodes.map((b) => b.value.trim().toUpperCase()),
      user_id: userId.trim(),
      office_id: officeId.trim(),
      postman: postmanName.trim(),
      beat_no: beats.toString().trim(),
    };

    try {
      const rawResponse = await axios.post(
        "https://ec.slpost.gov.lk/slpmail/forwardDelivery.php",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "ReactNativeApp",
          },
          timeout: 10000,
          responseType: "text",
        }
      );

      const cleaned = rawResponse.data.replace(/^\d+/, "");
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.error("Failed to parse response:", err.message);
        Alert.alert("Error", "Received invalid response from server.");
        return;
      }

      const results = Array.isArray(parsed?.Results) ? parsed.Results : [];

      if (results.length === 0) {
        Alert.alert(
          parsed.Status || "No Results",
          "Server responded but returned no result messages."
        );
        return;
      }

      setResultMessages(results);
      setResultModalVisible(true);

      const stored = await loadBarcodes();
      const updated = stored.map((b) =>
        barcodes.some((item) => item.value === b.value)
          ? { ...b, status: "delivered" }
          : b
      );
      await storeBarcodes(updated);
      setBarcodes([]);
      setBarcodeInput("");
      setPostmanName("");
      setbeats("");
    } catch (error) {
      console.error("Delivery error:", error.response?.data || error.message);
      Alert.alert(
        "Delivery Failed",
        error.response?.data?.message || "Unable to send delivery data."
      );
    }
  };

  const beatOptions = [];
  for (let i = 1; i <= assignedBeatNumber; i++) {
    beatOptions.push(i.toString());
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Postman Name"
          value={postmanName}
          onChangeText={setPostmanName}
        />
      </View>

      {assignedBeatNumber > 1 ? (
        <View style={styles.inputRow}>
          <Text style={styles.label}>Beat Number:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={beats}
              onValueChange={setbeats}
              style={styles.picker}
              dropdownIconColor="#333"
            >
              <Picker.Item label="-- Select Beat --" value="" />
              {beatOptions.map((num) => (
                <Picker.Item key={num} label={num} value={num} />
              ))}
            </Picker>
          </View>
        </View>
      ) : (
        <View style={styles.inputRow}>
          <Text style={styles.label}>Beat Number:</Text>
          <View style={styles.pickerWrapper}>
            <Text style={styles.singleValueText}>1</Text>
          </View>
        </View>
      )}

      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Barcode"
          value={barcodeInput}
          onChangeText={setBarcodeInput}
          returnKeyType="done"
          onSubmitEditing={handleAddBarcode}
          maxLength={13}
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

      <ResultModal
        visible={resultModalVisible}
        results={resultMessages}
        onClose={() => setResultModalVisible(false)}
      />
    </View>
  );
};

export default DeliveryScreen;
