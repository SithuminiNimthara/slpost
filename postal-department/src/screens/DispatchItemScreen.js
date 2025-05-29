import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import styles from "../styles/acceptanceFormStyles";

const offices = [
  { label: "Select PO Office", value: "" },
  { label: "Colombo GPO", value: "colombo" },
  { label: "Kandy", value: "kandy" },
];

const DispatchItemScreen = () => {
  const [selectedOffice, setSelectedOffice] = useState("");
  const [barcode, setBarcode] = useState("");
  const [barcodes, setBarcodes] = useState([]);
  const [neckLabel, setNeckLabel] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [scanningType, setScanningType] = useState("");

  const handleAddBarcode = () => {
    if (!barcode.trim()) {
      Alert.alert("Error", "Please enter a barcode.");
      return;
    }
    setBarcodes((prev) => [...prev, barcode.trim()]);
    setBarcode("");
  };

  const handleStoreNeckLabel = () => {
    if (!neckLabel.trim()) {
      Alert.alert("Error", "Please enter a neck label barcode.");
      return;
    }
    Alert.alert("Success", "Neck label and barcodes stored!");
    setNeckLabel("");
    setBarcodes([]);
  };

  const handleScanIconPress = (type) => {
    setScanningType(type);
    setModalVisible(true);
  };

  const handleBarcodeScanned = (scannedData) => {
    if (!scannedData) return;
    if (scanningType === "item") {
      setBarcode(scannedData);
    } else if (scanningType === "neck") {
      setNeckLabel(scannedData);
    }
    setModalVisible(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: "#f7f9fc" }]}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={[styles.formContainer, { marginTop: 30 }]}>
        <Text style={[styles.title, { color: "#1e90ff", marginBottom: 25 }]}>
          Send Item To Destination Office
        </Text>

        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, marginBottom: 8, color: "#333" }}>
              Select Delivery Office:
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                marginBottom: 18,
                backgroundColor: "#fff",
              }}
            >
              <Picker
                selectedValue={selectedOffice}
                onValueChange={(value) => setSelectedOffice(value)}
                style={{ height: 40 }}
              >
                {offices.map((office) => (
                  <Picker.Item
                    key={office.value}
                    label={office.label}
                    value={office.value}
                  />
                ))}
              </Picker>
            </View>

            {/* Barcode Input */}
            <Text style={{ fontSize: 16, marginBottom: 8, color: "#333" }}>
              Barcode No:
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <TextInput
                style={[
                  styles.input,
                  {
                    flex: 1,
                    marginRight: 8,
                    height: 40,
                    backgroundColor: "#fff",
                    borderColor: "#ccc",
                    borderWidth: 1,
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    color: "#333",
                  },
                ]}
                placeholder="Enter barcode"
                placeholderTextColor="#888"
                value={barcode}
                onChangeText={setBarcode}
              />
              <TouchableOpacity onPress={() => handleScanIconPress("item")}>
                <MaterialCommunityIcons
                  name="barcode-scan"
                  size={28}
                  color="black"
                  style={{ marginRight: 6 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddBarcode}
                style={{
                  backgroundColor: "#1e90ff",
                  borderRadius: 4,
                  paddingVertical: 7,
                  paddingHorizontal: 18,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}
                >
                  Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ width: 200, marginLeft: 30 }}>
            <Text style={{ color: "#666", fontSize: 15, marginTop: 5 }}>
              Please select the destination office from{"\n"}the dropdown menu.
            </Text>
          </View>
        </View>

        {/* Barcode List */}
        {barcodes.length > 0 && (
          <View style={{ marginBottom: 18, marginLeft: 2 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                marginBottom: 6,
                color: "#333",
              }}
            >
              Total Barcodes: {barcodes.length}
            </Text>
            <FlatList
              data={barcodes}
              keyExtractor={(item, idx) => idx.toString()}
              renderItem={({ item }) => (
                <Text style={{ fontSize: 15, marginLeft: 10, color: "#444" }}>
                  • {item}
                </Text>
              )}
              style={{ maxHeight: 100 }}
            />
          </View>
        )}

        {/* Neck Label */}
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
        >
          <Text style={{ fontSize: 16, flex: 1, color: "#333" }}>
            Neck Label Barcode:
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                flex: 2,
                marginRight: 8,
                height: 40,
                backgroundColor: "#fff",
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
                color: "#333",
              },
            ]}
            placeholder="Enter neck label barcode"
            placeholderTextColor="#888"
            value={neckLabel}
            onChangeText={setNeckLabel}
          />
          <TouchableOpacity onPress={() => handleScanIconPress("neck")}>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={28}
              color="black"
              style={{ marginRight: 6 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleStoreNeckLabel}
            style={{
              backgroundColor: "#1e90ff",
              borderRadius: 4,
              paddingVertical: 7,
              paddingHorizontal: 18,
            }}
          >
            <Text style={{ color: "#000", fontWeight: "bold", fontSize: 15 }}>
              Store
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal */}
      <BarcodeScannerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onScan={handleBarcodeScanned}
      />
    </ScrollView>
  );
};

export default DispatchItemScreen;
