import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EPayScreen = ({ navigation }) => {
  const [pinNo, setpinNo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [inputNo, setInputNo] = useState("");

  useEffect(() => {
    const loadpinNo = async () => {
      const storedNo = await AsyncStorage.getItem("pinNo");
      if (storedNo) {
        setpinNo(storedNo);
      } else {
        setShowModal(true);
      }
    };
    loadpinNo();
  }, []);

  const handleSavepinNo = async () => {
    if (inputNo.trim() === "") {
      Alert.alert("Error", "Please enter a valid PIN No");
      return;
    }
    await AsyncStorage.setItem("pinNo", inputNo);
    setpinNo(inputNo);
    setShowModal(false);
  };

  const handleChangePin = () => {
    setInputNo(pinNo);
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header with Pin No top-right */}
      <View style={styles.topRightContainer}>
        {pinNo ? (
          <TouchableOpacity onPress={handleChangePin} style={styles.pinBox}>
            <Text style={styles.fixedNoText}>PIN No: {pinNo}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.content}>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("MobitelSms")}
          >
            <FontAwesome5 name="mobile-alt" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}>Mobitel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("PMT")}
          >
            <FontAwesome5 name="tint" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}>PMT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("CEBSms")}
          >
            <FontAwesome5 name="bolt" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}>CEB</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("MEPayReport")}
          >
            <FontAwesome5 name="file-alt" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}>Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal to prompt for or change Epay No */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}
            >
              {pinNo ? "Change" : "Enter"} your PIN No
            </Text>
            <TextInput
              placeholder="Enter PIN No"
              value={inputNo}
              onChangeText={setInputNo}
              style={styles.modalInput}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleSavepinNo}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  gridItem: {
    width: "40%",
    backgroundColor: "#f4f4f4",
    margin: 10,
    padding: 25,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#9C1D1D",
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#9C1D1D",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  topRightContainer: {
    alignItems: "flex-end",
    marginRight: 20,
    marginTop: 10,
  },

  pinBox: {
    backgroundColor: "#FDECEA", // Light red background
    borderColor: "#9C1D1D", // Dark red border
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },

  fixedNoText: {
    color: "#9C1D1D",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EPayScreen;
