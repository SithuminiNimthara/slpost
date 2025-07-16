import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns"; // install with: npm install date-fns

const OFFENCE_LIST = Array.from({ length: 33 }, (_, i) => (i + 1).toString());

const OSFSmsScreen = () => {
  const [vehicleNo, setVehicleNo] = useState("");
  const [selectedOffences, setSelectedOffences] = useState([]);
  const [offenceDate, setOffenceDate] = useState("");
  const [policeCode, setPoliceCode] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const toggleOffence = (number) => {
    setSelectedOffences((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number)
        : [...prev, number]
    );
  };

  const handleSubmit = async () => {
    if (
      !vehicleNo ||
      selectedOffences.length === 0 ||
      !offenceDate ||
      !policeCode ||
      !totalAmount
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (isNaN(totalAmount) || Number(totalAmount) <= 0) {
      Alert.alert("Error", "Total amount must be a valid positive number.");
      return;
    }

    const offences = selectedOffences.join(",");

    try {
      // const response = await sendSms("osf", {
      //   vehicleNo,
      //   offences,
      //   offenceDate,
      //   policeCode,
      //   totalAmount,
      // });
      Alert.alert("Success", "SMS sent. Awaiting reply.");
    } catch (error) {
      Alert.alert("Error", "Failed to send SMS.");
    }
  };

  const renderOffenceItem = ({ item }) => {
    const selected = selectedOffences.includes(item);
    return (
      <TouchableOpacity
        style={[styles.offenceItem, selected && styles.offenceItemSelected]}
        onPress={() => toggleOffence(item)}
      >
        <MaterialIcons
          name={selected ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={selected ? "#9C1D1D" : "#777"}
        />
        <Text style={styles.offenceText}>Offence {item}</Text>
      </TouchableOpacity>
    );
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formatted = format(selectedDate, "MM-dd"); // → e.g., "07-04"
      setOffenceDate(formatted);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Vehicle Number</Text>
              <TextInput
                style={styles.input}
                value={vehicleNo}
                onChangeText={setVehicleNo}
                placeholder="e.g., CAA1234"
                autoCapitalize="characters"
                placeholderTextColor="#999"
              />
            </View>

            <Text style={[styles.label, { marginTop: 16 }]}>
              Select Offence Number(s)
            </Text>
            <FlatList
              data={OFFENCE_LIST}
              renderItem={renderOffenceItem}
              keyExtractor={(item) => item}
              numColumns={3}
              scrollEnabled={false}
              contentContainerStyle={styles.offenceList}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Offence Date (MM-DD)</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={{ color: offenceDate ? "#222" : "#999", fontSize: 16 }}
                >
                  {offenceDate || "Select date"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Police Code</Text>
              <TextInput
                style={styles.input}
                value={policeCode}
                onChangeText={setPoliceCode}
                placeholder="Enter Police Code"
                placeholderTextColor="#999"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Amount (Rs)</Text>
              <TextInput
                style={styles.input}
                value={totalAmount}
                onChangeText={setTotalAmount}
                placeholder="e.g., 5000"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Send SMS</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

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
  offenceList: {
    marginVertical: 10,
  },
  offenceItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
    marginVertical: 6,
    marginRight: 10,
  },
  offenceItemSelected: {
    backgroundColor: "#f9eaea",
    borderRadius: 8,
    padding: 4,
  },
  offenceText: {
    marginLeft: 6,
    color: "#333",
    fontSize: 14,
  },
});

export default OSFSmsScreen;
