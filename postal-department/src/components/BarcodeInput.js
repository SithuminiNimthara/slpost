import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const BarcodeInput = ({
  barcode,
  setBarcode,
  onTrack,
  onScan,
  errorMessage,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Barcode</Text>
      <TouchableOpacity onPress={onScan} style={styles.cameraIcon}>
        <MaterialCommunityIcons name="barcode-scan" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            errorMessage ? { borderColor: "red", borderWidth: 1 } : null,
          ]}
          placeholder="Scan or enter barcode"
          value={barcode}
          onChangeText={setBarcode}
          autoCapitalize="characters"
          maxLength={13}
        />
        <TouchableOpacity style={styles.trackButton} onPress={onTrack}>
          <Text style={styles.trackButtonText}>Track</Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
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
  errorMessage: {
    color: "red",
    marginTop: 5,
    fontSize: 13,
  },
});

export default BarcodeInput;
