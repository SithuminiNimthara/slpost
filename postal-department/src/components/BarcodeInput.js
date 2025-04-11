import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const BarcodeInput = ({ barcode, setBarcode, onTrack, onScan }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Barcode</Text>
      <TouchableOpacity onPress={onScan} style={styles.cameraIcon}>
        <MaterialCommunityIcons name="barcode-scan" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Scan or enter barcode"
          value={barcode}
          onChangeText={(text) => setBarcode(text.toUpperCase())}
        />
        <TouchableOpacity style={styles.trackButton} onPress={onTrack}>
          <Text style={styles.trackButtonText}>Track</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9D9D9",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  label: { fontSize: 16, fontWeight: "bold" },
  cameraIcon: { position: "absolute", right: 15, top: 15 },
  inputRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: { flex: 1, backgroundColor: "white", padding: 10, borderRadius: 5 },
  trackButton: {
    backgroundColor: "#9C1D1D",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  trackButtonText: { color: "white", fontWeight: "bold" },
});

export default BarcodeInput;
