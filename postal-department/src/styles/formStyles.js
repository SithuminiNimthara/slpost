import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },

  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 5,
  },
});

export default styles;
