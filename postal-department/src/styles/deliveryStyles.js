import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 18,
    justifyContent: "flex-start",
  },
  header: {
    backgroundColor: "#B32A2A",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    padding: 16,
    marginBottom: 18,
  },
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "left",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    height: 46,
    fontSize: 16,
    backgroundColor: "transparent",
  },
  scanButton: {
    padding: 8,
  },
  addButtonSmall: {
    backgroundColor: "#B32A2A",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonTextSmall: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    justifyContent: "space-between",
  },
  listText: {
    fontSize: 16,
    color: "#222",
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#bbb",
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    backgroundColor: "#B32A2A",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
  },
  pickerWrapper: {
    flex: 1,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    paddingHorizontal: 10,
    margin: 10,
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#333",
    fontSize: 16,
  },

  // ================= Modal Styles =================
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#B32A2A",
    textAlign: "center",
  },
  modalScroll: {
    marginBottom: 20,
  },
  modalItem: {
    fontSize: 16,
    marginBottom: 8,
  },
  modalCloseButton: {
    backgroundColor: "#B32A2A",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default styles;
