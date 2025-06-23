import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingHorizontal: 10,
  },
  headerBox: {
    backgroundColor: "#B32A2A",
    padding: 12,
    marginBottom: 18,
    marginTop: 10,
    alignItems: "center",
    borderRadius: 4,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#B32A2A",
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 18,
    margin: 10,
    alignItems: "center",
    minWidth: 120,
  },
  dateButtonText: {
    color: "#B32A2A",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
  submitRow: {
    alignItems: "center",
    marginBottom: 10,
  },
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
  sectionTitle: {
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 4,
    fontSize: 18,
  },
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
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default styles;
