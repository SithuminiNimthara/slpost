import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import styles from "../styles/BarcodeScannerModalStyles";

const BarcodeScannerModal = ({ visible, onClose, onScan }) => {
  const [camPermissionStatus, requestCamPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [scanned, setScanned] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      if (!camPermissionStatus?.granted) {
        const { granted } = await requestCamPermission();
        console.log("Camera permission granted:", granted);
      }
    };
    requestPermissions();
  }, [camPermissionStatus]);

  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  const handleBarCodeScanned = (scanData) => {
    if (!scanned) {
      const { type, data } = scanData;
      console.log(`Barcode scanned! Type: ${type}, Data: ${data}`);
      setScanned(true);
      if (onScan) {
        console.log("Passing scanned data to parent:", data);
        onScan(data);
      }
    }
  };

  const handleCameraReady = () => {
    console.log("Camera is ready and waiting for barcode...");
    setIsCameraReady(true);
  };

  const handleScanAgain = () => {
    setScanned(false);
  };

  if (camPermissionStatus?.granted === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {camPermissionStatus?.granted && (
          <CameraView
            style={StyleSheet.absoluteFillObject}
            ref={cameraRef}
            onCameraReady={handleCameraReady}
            barCodeScannerSettings={{
              barCodeTypes: [
                "qr",
                "ean13",
                "ean8",
                "upc_a",
                "upc_e",
                "code128",
                "code39",
                "code93",
                "itf14",
                "pdf417",
                "aztec",
                "datamatrix",
              ],
            }}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} // Only scan if not already scanned
          />
        )}

        {!isCameraReady && <ActivityIndicator size="large" color="#0000ff" />}

        {/* Scanner Overlay */}
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleContainer}>
            <View style={styles.sideOverlay} />
            <View style={styles.scannerBorder}>
              <Text style={styles.scanText}>
                Align the barcode within the frame
              </Text>
            </View>
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay} />
        </View>

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        {scanned && <Button title={"Scan Again"} onPress={handleScanAgain} />}
      </View>
    </Modal>
  );
};



export default BarcodeScannerModal;
