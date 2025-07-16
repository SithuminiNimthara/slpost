import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import BarcodeInput from "../components/BarcodeInput";
import { fetchItemDetails } from "../utils/api";

const TrackItem = () => {
  const [barcode, setBarcode] = useState("");
  const [itemDetails, setItemDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle barcode input change (no validation)
  const handleBarcodeChange = (value) => {
    setBarcode(value.toUpperCase());
  };

  // Handle barcode scan event
  const handleBarCodeScanned = (scannedData) => {
    if (!scannedData || scannedData.trim() === "") {
      setError("Invalid barcode scanned. Please try again.");
      return;
    }
    const upperScanned = scannedData.toUpperCase();
    setBarcode(upperScanned);
    fetchDetails(upperScanned);
    setModalVisible(false);
  };

  // Fetch item details (with loading state)
  const fetchDetails = async (code) => {
    setLoading(true);
    setError("");
    setItemDetails([]);
    await fetchItemDetails(code, setItemDetails, setError);
    setLoading(false);
  };

  // Fetch item details manually (no validation)
  const handleFetchItemDetails = () => {
    if (!barcode.trim()) {
      setError("Please enter a barcode to track the item.");
      return;
    }
    setError("");
    fetchDetails(barcode);
  };

  return (
    <View style={styles.container}>
      {/* Barcode Input Field */}
      <BarcodeInput
        barcode={barcode}
        setBarcode={handleBarcodeChange}
        onTrack={handleFetchItemDetails}
        onScan={() => setModalVisible(true)}
        errorMessage={""} // No validation error
        
      />

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#B32A2A"
          style={{ marginTop: 20 }}
        />
      )}

      {/* Item Details Display */}
      {!loading && itemDetails.length > 0 && (
        <FlatList
          data={itemDetails}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <Text style={styles.eventTitle}>
                Event {item.Eventid}: {item.EventName}
              </Text>
              <Text style={styles.detail}>Date & Time: {item.Tdatetime}</Text>
              <Text style={styles.detail}>Location: {item.location_name}</Text>
            </View>
          )}
          nestedScrollEnabled
        />
      )}

      {/* No Results */}
      {!loading && !error && itemDetails.length === 0 && (
        <Text style={styles.noResults}>No tracking events to display.</Text>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onScan={handleBarCodeScanned}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20 },
  error: { color: "red", marginTop: 10, fontSize: 16, textAlign: "center" },
  noResults: {
    color: "#555",
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
  },
  eventItem: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    marginVertical: 7,
    borderRadius: 6,
    elevation: 1,
  },
  eventTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 3 },
  detail: { fontSize: 15, color: "#333" },
});

export default TrackItem;
