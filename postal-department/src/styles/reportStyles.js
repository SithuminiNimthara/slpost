import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingHorizontal: 10,
  },

  // Checkboxes
  checkBoxGroup: {
    marginBottom: 20,
    marginTop: 20,
  },
  checkBoxRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  checkBoxRowSelected: {
    backgroundColor: "#ddd",
    borderColor: "#B32A2A",
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: "#555",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkBoxChecked: {
    width: 10,
    height: 10,
    backgroundColor: "#B32A2A",
    borderRadius: 1,
  },
  checkBoxLabel: {
    fontSize: 16,
    color: "#333",
  },

  // Date Buttons
  dateButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#B32A2A",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 10,
    alignItems: "center",
    minWidth: 120,
    flexDirection: "row",
  },
  dateButtonText: {
    color: "#B32A2A",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },

  // Submit Button
  submitButton: {
    backgroundColor: "#B32A2A",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Section Titles (like <username> : date to date Report)
  sectionTitle: {
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 4,
    fontSize: 18,
  },

  // Table Styling
  table: {
    borderWidth: 1,
    borderColor: "#888",
    marginVertical: 5,
    marginBottom: 12,
    backgroundColor: "#f7f7f7",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: "#e0e0e0",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#888",
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 13,
    color: "#444",
    textAlign: "center",
  },
  tableCellText: {
    fontSize: 13,
    color: "#222",
    textAlign: "center",
  },

  // Error
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default styles;
