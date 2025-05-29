import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import BarcodeScannerModal from "../components/BarcodeScannerModal"; // Make sure this path is correct

const MarkReceiveScreen = () => {
  const [neckLabel, setNeckLabel] = useState("");
  const [barcodeList, setBarcodeList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleViewList = () => {
    if (!neckLabel.trim()) {
      Alert.alert("Error", "Please enter a neck label barcode.");
      return;
    }
    // Replace with real API call
    setBarcodeList(["RL123456789LK", "RL987654321LK", "RL112233445LK"]);
  };

  const handleBarcodeScanned = (scannedData) => {
    if (!scannedData) return;
    setNeckLabel(scannedData.toUpperCase());
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Item Receive</Text>

      <Text style={styles.label}>Neck Label Barcode</Text>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.cameraIcon}
      >
        <MaterialCommunityIcons name="barcode-scan" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="NECK LABEL"
          value={neckLabel}
          onChangeText={(text) => setNeckLabel(text.toUpperCase())}
        />
        <TouchableOpacity style={styles.button} onPress={handleViewList}>
          <Text style={styles.buttonText}>View List</Text>
        </TouchableOpacity>
      </View>

      {barcodeList.length > 0 && (
        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Barcodes under Neck Label:</Text>
          <FlatList
            data={barcodeList}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.barcodeItem}>• {item}</Text>
            )}
          />
        </View>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onScan={handleBarcodeScanned}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9D9D9",
    padding: 20,
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cameraIcon: {
    position: "absolute",
    marginBottom: 10,
    right: 25,
    top: 75,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#9C1D1D",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  barcodeItem: {
    fontSize: 14,
    marginLeft: 10,
    paddingVertical: 2,
  },
});

export default MarkReceiveScreen;
