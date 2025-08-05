import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f2f5",
    padding: 20,
    justifyContent: "center",
  },
  card: {
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
    justifyContent: "center",
    display: "flex",
  },
  button: {
    backgroundColor: "#9C1D1D",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  breakdownText: {
    fontSize: 13,
    marginTop: 6,
    color: "#777",
    fontStyle: "italic",
  },
  replyBox: {
    marginTop: 25,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FDECEA",
    borderColor: "#f5c6cb",
    borderWidth: 1,
  },
  replyTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#9C1D1D",
    marginBottom: 5,
  },
  replyText: {
    fontSize: 15,
    color: "#9C1D1D",
  },
  replyTime: {
    fontSize: 12,
    color: "#9C1D1D",
    marginTop: 8,
  },
});

export default styles;
 