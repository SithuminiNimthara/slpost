import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { sendSms } from "../utils/sendSLPMailSms";
import moment from "moment";
import styles from "../styles/smsreportStyles";

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
    if (datePickerMode === "date") setDate(selected);
    if (datePickerMode === "start") setStartDate(selected);
    if (datePickerMode === "end") setEndDate(selected);
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
      const response = await sendSms("slpr", payload);

      if (response?.fullMessage) {
        setSmsResponse(response.fullMessage);
        Alert.alert("Success", "Report received.");
      } else {
        setSmsResponse("Report SMS sent. Awaiting response...");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send SMS");
      setSmsResponse("Failed to send or receive SMS.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
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
