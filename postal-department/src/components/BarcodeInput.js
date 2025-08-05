import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const BarcodeInput = ({
  barcode,
  setBarcode,
  onTrack,
  onScan,
  errorMessage,
  loading = false,
  buttonLabel = "Track",
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Barcode</Text>

      {/* Camera icon for scanning */}
      <TouchableOpacity
        onPress={onScan}
        style={styles.cameraIcon}
        accessible={true}
        accessibilityLabel="Scan barcode"
      >
        <MaterialCommunityIcons name="barcode-scan" size={24} color="black" />
      </TouchableOpacity>

      {/* Input + Track button */}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, errorMessage ? { borderColor: "red" } : null]}
          placeholder="Scan or enter barcode"
          value={barcode}
          onChangeText={setBarcode}
          autoCapitalize="characters"
          maxLength={13}
          keyboardType="default"
          accessible={true}
          accessibilityLabel="Barcode input field"
        />

        <TouchableOpacity
          style={styles.trackButton}
          onPress={onTrack}
          disabled={loading}
          accessible={true}
          accessibilityLabel="Track barcode"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.trackButtonText}>{buttonLabel || "Track"}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Error message */}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cameraIcon: {
    position: "absolute",
    right: 15,
    top: 15,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  trackButton: {
    backgroundColor: "#9C1D1D",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  trackButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorMessage: {
    color: "red",
    marginTop: 5,
    fontSize: 13,
  },
});

export default BarcodeInput;
