import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#9C1D1D",
  },
  barcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    justifyContent: "space-between",
  },
  barcodeInput: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#B03A3A", // lighter red shade
    fontSize: 16,
  },
  button: {
    backgroundColor: "#9C1D1D",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#9C1D1D",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#B03A3A", // softer border red
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  readOnlyInput: {
    backgroundColor: "#f9f0f0", // soft red-gray for read-only fields
  },
  errorText: {
    color: "#B00020", // deep red for errors
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
  replyContainer: {
    backgroundColor: "#FBEAEA", // very light red background
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    borderColor: "#9C1D1D",
    borderWidth: 1,
  },
  replyTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#9C1D1D",
    marginBottom: 10,
  },
  replyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
});

export default styles;
