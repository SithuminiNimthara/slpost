import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import BarcodeInput from "../components/BarcodeInput";
import { fetchItemDetails } from "../utils/api"; // Fetch item details from API
import eventMapping from "../utils/eventMapping"; // Maps event IDs to descriptions

const TrackItem = () => {
  const [barcode, setBarcode] = useState(""); // Holds the scanned barcode
  const [itemDetails, setItemDetails] = useState([]); // Stores fetched item details
  const [modalVisible, setModalVisible] = useState(false); // Controls modal visibility
  const [error, setError] = useState(""); // Error state

  // Handle barcode scan event
  const handleBarCodeScanned = (scannedData) => {
    console.log("Scanned Data Received:", scannedData);
    setBarcode(scannedData);
    fetchItemDetails(scannedData, setItemDetails, setError);
    setModalVisible(false); // Close the modal after scanning
  };

  // Fetch item details manually
  const handleFetchItemDetails = () => {
    if (barcode.trim()) {
      fetchItemDetails(barcode, setItemDetails, setError);
    } else {
      setError("Please enter a barcode");
    }
  };

  return (
    <View style={styles.container}>
      {/* Barcode Input Field */}
      <BarcodeInput
        barcode={barcode}
        setBarcode={setBarcode}
        onTrack={handleFetchItemDetails}
        onScan={() => setModalVisible(true)} // Open scanner modal
      />

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Item Details Display */}
      {itemDetails.length > 0 && (
        <FlatList
          data={itemDetails}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <Text style={styles.text}>
                Event {item.Eventid}: {eventMapping[item.Eventid] || "Unknown Event"}
              </Text>
              <Text style={styles.text}>Date & Time: {item.Tdatetime}</Text>
              <Text style={styles.text}>Location: {item.location_name}</Text>
            </View>
          )}
          nestedScrollEnabled
        />
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
  error: { color: "red", marginTop: 10 },
  eventItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  text: { fontSize: 16 },
});

export default TrackItem;
