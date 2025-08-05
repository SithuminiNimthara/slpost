import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f2f5",
    padding: 20,
    justifyContent: "center",
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#222",
  },
  button: {
    backgroundColor: "#9C1D1D",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#b00020",
    borderWidth: 2,
  },
  matchWarning: {
    color: "#b00020",
    fontSize: 13,
    marginTop: 4,
    fontWeight: "600",
  },
  replyBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#914c4cff",
    borderRadius: 10,
    borderColor: "#9C1D1D",
    borderWidth: 1,
  },
  replyTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 15,
    color: "#fff",
  },
  replyText: {
    fontSize: 15,
    color: "#fff",
  },
  spinnerContainer: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },
  maxAmountWarning: {
    color: "#b00020",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "600",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  totalBox: {
    backgroundColor: "#FDECEA",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f5c6cb",
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  totalLabel: {
    color: "#9C1D1D",
    fontSize: 13,
    fontWeight: "500",
  },
  totalValue: {
    color: "#9C1D1D",
    fontSize: 16,
    fontWeight: "bold",
  },
  replyBox: {
    backgroundColor: "#FDECEA",
    padding: 16,
    marginTop: 20,
    marginHorizontal: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f5c6cb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  replyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9C1D1D",
    marginBottom: 8,
  },
  replyText: {
    fontSize: 15,
    color: "#9C1D1D",
  },
  searchButtonWrapper: {
    alignItems: "flex-end",
    marginTop: 8,
  },

  searchButtonSmall: {
    backgroundColor: "#FDECEA",
    borderColor: "#9C1D1D",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },

  searchButtonText: {
    color: "#9C1D1D",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default styles;
