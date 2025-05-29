import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 20 },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    backgroundColor: "#9C1D1D",
    color: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
    textAlign: "center",
  },
  checkBoxGroup: { marginBottom: 20 },
  checkBoxRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  checkBoxRowSelected: {
    backgroundColor: "#c7bebe",
  },
  checkBox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#555",
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkBoxChecked: {
    width: 14,
    height: 14,
    backgroundColor: "#9C1D1D",
    borderRadius: 2,
  },
  checkBoxLabel: { fontSize: 16, color: "#222" },
  dateButton: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
  },
  dateText: { fontSize: 16, color: "#333" },
  submitButton: {
    backgroundColor: "#9C1D1D",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  submitButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  responseBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 20,
    marginTop: 30,
  },
  responseLabel: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  responseText: { fontSize: 16, color: "#333" },
});

export default styles;
