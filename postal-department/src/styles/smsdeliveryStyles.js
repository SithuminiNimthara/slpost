import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20, // Added horizontal padding for better layout on mobile
    paddingTop: 40, // Extra padding on top to give some breathing room
  },
  title: {
    fontSize: 24, // Increased font size for better readability on mobile
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30, // Adjusted space below the title
    color: "#333",
  }, 
  input: {
    height: 50, // Increased height for better interaction
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10, // Rounded corners for a smoother look
    paddingHorizontal: 15, // Added more padding inside inputs for comfort
    marginBottom: 20, // Increased margin between inputs for better spacing
    backgroundColor: "#fff",
    fontSize: 16, // Slightly larger font for easy readability
  },
  barcodeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30, // Increased margin for better separation
  },
  button: {
    backgroundColor: "#9C1D1D",
    paddingVertical: 14, // Increased vertical padding for larger touch area
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40, // More space from other elements
  }, 
  buttonText: {
    color: "#fff",
    fontSize: 18, // Slightly larger font for button text
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 14, // Slightly larger font for error message
    marginBottom: 12, // Increased space for error message
    textAlign: "center",
  },
  replyContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#9C1D1D",
    borderRadius: 10,
  },

  replyLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#fff",
  },

  replyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default styles;
