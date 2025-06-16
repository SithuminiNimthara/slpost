import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
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
    borderColor: "#ccc",
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
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  replyContainer: {
    backgroundColor: "#e1f5fe",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    borderColor: "#0288d1",
    borderWidth: 1,
  },

  replyTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#01579b",
    marginBottom: 10,
  },

  replyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
});

export default styles;
