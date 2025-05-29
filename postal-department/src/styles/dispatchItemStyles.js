import { StyleSheet } from "react-native";

const dispatchStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f4f4",
    padding: 15,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
    paddingHorizontal: 5,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  barcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "space-between",
  },

  actionButton: {
    backgroundColor: "#9C1D1D",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  scannedItem: {
    fontSize: 14,
    paddingVertical: 2,
    paddingLeft: 5,
  },
});

export default dispatchStyles;
