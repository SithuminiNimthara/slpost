import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../styles/reportStyles";

const ReportScreen = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("start");
  const [submitted, setSubmitted] = useState(false);

  const openPicker = (mode) => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      if (pickerMode === "start") setStartDate(selectedDate);
      else setEndDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (startDate && endDate) {
      setSubmitted(true);
    } else {
      setSubmitted(false);
      alert("Please select both start and end dates.");
    }
  };

  // Date formatting for YYYY/MM/DD
  const formatDate = (date) =>
    date
      ? `${date.getFullYear()}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`
      : "";

  return (
    <View style={styles.container}>
      {/* Date Buttons */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => openPicker("start")}
        >
          <Text style={styles.dateButtonText}>
            {startDate
              ? `Start Date\n${startDate.toLocaleDateString()}`
              : "Start Date"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => openPicker("end")}
        >
          <Text style={styles.dateButtonText}>
            {endDate ? `End Date\n${endDate.toLocaleDateString()}` : "End Date"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <View style={styles.submitRow}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Report Details */}
      {submitted && (
        <View style={styles.reportContainer}>
          <Text style={styles.reportTitle}>
            {formatDate(startDate)} to {formatDate(endDate)} for Report
          </Text>
        </View>
      )}

      {/* Date Picker Modal */}
      {showPicker && (
        <DateTimePicker
          value={
            pickerMode === "start"
              ? startDate || new Date()
              : endDate || new Date()
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

export default ReportScreen;
