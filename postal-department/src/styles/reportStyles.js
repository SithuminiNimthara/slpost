import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 0,
  },
  header: {
    backgroundColor: "#B32A2A",
    padding: 18,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    marginBottom: 30,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 10,
    gap: 20,
  },
  dateButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#444",
    minWidth: 120,
    alignItems: "center",
    marginRight: 12,
  },
  dateButtonText: {
    color: "#222",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },
  submitRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 24,
    marginRight: 32,
  },
  submitButton: {
    backgroundColor: "#B32A2A",
    paddingVertical: 10,
    paddingHorizontal: 26,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-end",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    // Elevation for Android
    elevation: 2,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  reportContainer: {
    marginTop: 28,
    alignItems: "center",
  },
  reportTitle: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 10,
  },
});

export default styles;
