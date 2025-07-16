import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import styles from "../styles/smsreportStyles";
import { sendSms } from "../utils/sendEcounterSms";

const REPORT_TYPES = [
  { key: "daily", label: "Daily" },
  { key: "date", label: "Date Wise" },
  { key: "range", label: "Date Range" },
];

const SMSReportScreen = () => {
  const [selectedType, setSelectedType] = useState("daily");
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState("");
  const [loading, setLoading] = useState(false);
  const [smsResponse, setSmsResponse] = useState("");

  const openPicker = (mode) => {
    setDatePickerMode(mode);
    setShowDatePicker(true);
  };

  const onDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (!selected) return;

    switch (datePickerMode) {
      case "date":
        setDate(selected);
        break;
      case "start":
        setStartDate(selected);
        break;
      case "end":
        setEndDate(selected);
        break;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSmsResponse("");

    const payload = {
      reportType: selectedType,
      date: moment(date).format("YYYY-MM-DD"),
      startDate: moment(startDate).format("YYYY-MM-DD"),
      endDate: moment(endDate).format("YYYY-MM-DD"),
    };

    try {
      const response = await sendSms("rpt", payload);

      if (response?.status === "success") {
        setSmsResponse(response.fullMessage);
        Alert.alert("Reply from 1919", response.fullMessage);
      } else {
        setSmsResponse("SMS sent. Awaiting reply...");
        Alert.alert("Notice", "SMS sent. Awaiting reply from 1919...");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send or receive SMS.");
      setSmsResponse("Failed to send or receive SMS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Report Type Selection */}
      <View style={styles.checkBoxGroup}>
        {REPORT_TYPES.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.checkBoxRow,
              selectedType === type.key && styles.checkBoxRowSelected,
            ]}
            onPress={() => setSelectedType(type.key)}
          >
            <View style={styles.checkBox}>
              {selectedType === type.key && (
                <View style={styles.checkBoxChecked} />
              )}
            </View>
            <Text style={styles.checkBoxLabel}>{type.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Pickers */}
      {selectedType === "date" && (
        <TouchableOpacity
          onPress={() => openPicker("date")}
          style={styles.dateButton}
        >
          <Text style={styles.dateText}>
            Date: {moment(date).format("YYYY-MM-DD")}
          </Text>
        </TouchableOpacity>
      )}

      {selectedType === "range" && (
        <>
          <TouchableOpacity
            onPress={() => openPicker("start")}
            style={styles.dateButton}
          >
            <Text style={styles.dateText}>
              Start: {moment(startDate).format("YYYY-MM-DD")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openPicker("end")}
            style={styles.dateButton}
          >
            <Text style={styles.dateText}>
              End: {moment(endDate).format("YYYY-MM-DD")}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={
            datePickerMode === "date"
              ? date
              : datePickerMode === "start"
              ? startDate
              : endDate
          }
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>

      {/* SMS Response */}
      {smsResponse ? (
        <View style={styles.responseBox}>
          <Text style={styles.responseLabel}>Reply Message:</Text>
          {smsResponse.split("\n").map((line, index) => (
            <Text key={index} style={styles.responseText}>
              {line.trim()}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default SMSReportScreen;
