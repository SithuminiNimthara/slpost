import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1, // Allows content to be scrollable
    paddingBottom: 20, // Prevents content from being cut off at the bottom
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    marginTop: 20,
  },
  gridItem: {
    width: "40%",
    backgroundColor: "#eee",
    margin: 10,
    padding: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  gridText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9C1D1D",
    marginTop: 10,
    textAlign: "center",
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginVertical: 20,
  },
  smsSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9C1D1D",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default styles;
