import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#9C1D1D",
    fontSize: 18,
    marginBottom: 10,
  },
  logo: {
    width: 400,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  input: {
    width: "100%",
    backgroundColor: "#9C1D1D",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: "white",
  },
  button: {
    backgroundColor: "#9C1D1D",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontWeight: "bold",
  },
  
});
export default styles;
