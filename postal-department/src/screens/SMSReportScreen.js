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
import { sendSms } from "../utils/sendSms";
import moment from "moment";
import SmsListener from "react-native-android-sms-listener";
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
  const smsListenerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (smsListenerRef.current) {
        smsListenerRef.current.remove();
      }
    };
  }, []);

  const listenForSms = (expectedType, expectedDate, expectedStart, expectedEnd) => {
    if (smsListenerRef.current) {
      smsListenerRef.current.remove();
    }
    smsListenerRef.current = SmsListener.addListener((sms) => {
      if (sms.originatingAddress === "1919") {
        const body = sms.body.toLowerCase();

        if (expectedType === "daily" && body.includes("slpr")) {
          setSmsResponse(sms.body);
          smsListenerRef.current.remove();
        } else if (
          expectedType === "date" &&
          body.includes(moment(expectedDate).format("YYYY-MM-DD"))
        ) {
          setSmsResponse(sms.body);
          smsListenerRef.current.remove();
        } else if (
          expectedType === "range" &&
          body.includes(moment(expectedStart).format("YYYY-MM-DD")) &&
          body.includes(moment(expectedEnd).format("YYYY-MM-DD"))
        ) {
          setSmsResponse(sms.body);
          smsListenerRef.current.remove();
        }
      }
    });
  };

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
      listenForSms(selectedType, date, startDate, endDate);
      await sendSms("slpr", payload);
      setSmsResponse("Report SMS sent successfully. Waiting for reply...");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send SMS");
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
              {selectedType === type.key && <View style={styles.checkBoxChecked} />}
            </View>
            <Text style={styles.checkBoxLabel}>{type.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedType === "date" && (
        <TouchableOpacity onPress={() => openPicker("date")} style={styles.dateButton}>
          <Text style={styles.dateText}>Date: {moment(date).format("YYYY-MM-DD")}</Text>
        </TouchableOpacity>
      )}
      {selectedType === "range" && (
        <>
          <TouchableOpacity onPress={() => openPicker("start")} style={styles.dateButton}>
            <Text style={styles.dateText}>Start: {moment(startDate).format("YYYY-MM-DD")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openPicker("end")} style={styles.dateButton}>
            <Text style={styles.dateText}>End: {moment(endDate).format("YYYY-MM-DD")}</Text>
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
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit</Text>}
      </TouchableOpacity>

      {smsResponse ? (
        <View style={styles.responseBox}>
          <Text style={styles.responseLabel}>Response:</Text>
          <Text style={styles.responseText}>{smsResponse}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default SMSReportScreen;
