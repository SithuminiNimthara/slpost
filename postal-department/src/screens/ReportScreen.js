import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import styles from "../styles/reportStyles";

const ReportScreen = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("start");
  const [submitted, setSubmitted] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [officeId, setOfficeId] = useState("");
  const [userName, setUserName] = useState("");

  // Load user info on mount
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) {
        const user = JSON.parse(userData);
        setUserId(user.User_id || "");
        setOfficeId(user.Location_id || user.office_id || "");
        setUserName(user.Name || "");
      }
    };
    loadUser();
  }, []);

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

  // Format for API: YYYY-MM-DD HH:mm:ss
  const formatDateForApi = (date, isStart) => {
    if (!date) return "";
    const yyyy = date.getFullYear();
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    const time = isStart ? "00:00:01" : "23:59:59";
    return `${yyyy}-${mm}-${dd} ${time}`;
  };

  // Format for display: YYYY/MM/DD
  const formatDateDisplay = (date) =>
    date
      ? `${date.getFullYear()}/${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`
      : "";

  const handleSubmit = async () => {
    if (startDate && endDate && userId && officeId) {
      setSubmitted(true);
      setLoading(true);
      setError("");
      setReportData(null);
      try {
        const payload = {
          user_id: userId,
          office_id: officeId,
          s_date: formatDateForApi(startDate, true),
          e_date: formatDateForApi(endDate, false),
        };
        const response = await axios.post(
          "https://ec.slpost.gov.lk/slpmail/forwardReport.php",
          payload,
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10000,
          }
        );
        setReportData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch report data."
        );
      }
      setLoading(false);
    } else {
      setSubmitted(false);
      alert("Please select both start and end dates.");
    }
  };

  // Table rendering helpers
  const renderTable = (headers, values) => (
    <View style={styles.table}>
      <View style={styles.tableRowHeader}>
        {headers.map((header, idx) => (
          <View style={styles.tableCell} key={idx}>
            <Text style={styles.tableHeaderText}>{header}</Text>
          </View>
        ))}
      </View>
      <View style={styles.tableRow}>
        {values.map((val, idx) => (
          <View style={styles.tableCell} key={idx}>
            <Text style={styles.tableCellText}>{val}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  // Render report details like the screenshot
  const renderReport = () => {
    if (!reportData || !reportData.Results || reportData.Results.length === 0)
      return null;

    const result = reportData.Results[0];
    const sDate = formatDateDisplay(startDate);
    const eDate = formatDateDisplay(endDate);

    // User summary table
    const userHeaders = [
      "Accept Qty",
      "Accept Amount(Rs)",
      "Delivery Qty",
    ];
    const userValues = [
      result.accept_qty_user,
      result.accept_amount_user,
      result.dly_qty_user,
    ];

    // Office summary table
    const officeHeaders = ["Accept Qty", "Accept Amount(Rs) ", "Delivery Qty"];
    const officeValues = [
      result.accept_qty,
      result.accept_amount,
      result.dly_qty,
    ];

    return (
      <View style={{ marginTop: 20 }}>
        <Text style={styles.sectionTitle}>
          {`${userName} :  ${sDate}  to  ${eDate}  Report`}
        </Text>
        {renderTable(userHeaders, userValues)}
        <Text style={styles.sectionTitle}>
          {`${result.poname} :  ${sDate}  to  ${eDate}  Report`}
        </Text>
        {renderTable(officeHeaders, officeValues)}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Date Buttons */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => openPicker("start")}
        >
          <Text style={styles.dateButtonText}>
            {startDate ? formatDateDisplay(startDate) : "Start Date"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => openPicker("end")}
        >
          <Text style={styles.dateButtonText}>
            {endDate ? formatDateDisplay(endDate) : "End Date"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <View style={styles.submitRow}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="#B32A2A"
          style={{ marginTop: 20 }}
        />
      )}

      {/* Error */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Report Details */}
      {submitted && !loading && renderReport()}

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
    </ScrollView>
  );
};

export default ReportScreen;
