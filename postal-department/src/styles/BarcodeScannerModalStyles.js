import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "center",
      alignItems: "center",
    },
    topOverlay: {
      flex: 1,
      width: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    middleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    sideOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    scannerBorder: {
      width: 250,
      height: 120,
      borderWidth: 4,
      borderColor: "red",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent",
    },
    scanText: {
      color: "white",
      fontSize: 14,
      textAlign: "center",
      position: "absolute",
      bottom: -20,
    },
    bottomOverlay: {
      flex: 1,
      width: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    cancelButton: {
      position: "absolute",
      top: 40,
      right: 20,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      padding: 10,
      borderRadius: 5,
    },
    cancelButtonText: {
      color: "white",
      fontSize: 18,
    },
    flashButton: {
      position: "absolute",
      bottom: 100,
      left: "50%",
      transform: [{ translateX: -50 }],
      backgroundColor: "black",
      padding: 10,
      borderRadius: 10,
    },
    flashButtonText: {
      color: "white",
      fontSize: 16,
    },
    
  });

  export default styles;