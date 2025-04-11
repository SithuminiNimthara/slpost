import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import BarcodeScannerModal from "../components/BarcodeScannerModal";
import BarcodeInput from "../components/BarcodeInput";
import { fetchItemDetails } from "../utils/api"; // Ensure this API call is working as expected
import eventMapping from "../utils/eventMapping"; // Maps event IDs to descriptions

const TrackItem = () => {
  const [barcode, setBarcode] = useState("");
  const [itemDetails, setItemDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");

  // Handle barcode scan event
  const handleBarCodeScanned = (scannedData) => {
    console.log("Scanned Data Received:", scannedData);
    if (!scannedData || scannedData.trim() === "") {
      setError("Invalid barcode scanned. Please try again.");
      return;
    }
    setBarcode(scannedData);
    fetchItemDetails(scannedData, setItemDetails, setError);
    setModalVisible(false); // Close the modal after scanning
  };

  // Fetch item details manually
  const handleFetchItemDetails = () => {
    if (barcode.trim()) {
      fetchItemDetails(barcode, setItemDetails, setError);
    } else {
      setError("Please enter a barcode to track the item.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Barcode Input Field */}
      <BarcodeInput
        barcode={barcode}
        setBarcode={setBarcode}
        onTrack={handleFetchItemDetails}
        onScan={() => setModalVisible(true)}
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
                Event {item.Eventid}:{" "}
                {eventMapping[item.Eventid] || "Unknown Event"}
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
  error: { color: "red", marginTop: 10, fontSize: 16 },
  eventItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  text: { fontSize: 16 },
});

export default TrackItem;
