import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";
import styles from "../styles/reportStyles";

const REPORT_TYPES = [
  { key: "daily", label: "Daily" },
  { key: "date", label: "Date Wise" },
  { key: "range", label: "Date Range" },
];

const ReportScreen = () => {
  const [selectedType, setSelectedType] = useState("daily");
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("");
  const [reportData, setReportData] = useState(null);
  const [userId, setUserId] = useState("");
  const [officeId, setOfficeId] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    if (!selectedDate) return;

    if (pickerMode === "date") setDate(selectedDate);
    if (pickerMode === "start") setStartDate(selectedDate);
    if (pickerMode === "end") setEndDate(selectedDate);
  };

  const formatDate = (d, isStart = true) =>
    moment(d).format(`YYYY-MM-DD ${isStart ? "00:00:01" : "23:59:59"}`);

  const handleSubmit = async () => {
    setLoading(true);
    setReportData(null);
    setError("");

    try {
      const payload = {
        user_id: userId,
        office_id: officeId,
      };

      if (selectedType === "daily" || selectedType === "date") {
        payload.s_date = formatDate(date, true);
        payload.e_date = formatDate(date, false);
      } else {
        payload.s_date = formatDate(startDate, true);
        payload.e_date = formatDate(endDate, false);
      }

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
  };

  const renderTable = (headers, values) => (
    <View style={styles.table}>
      <View style={styles.tableRowHeader}>
        {headers.map((header, index) => (
          <View key={index} style={styles.tableCell}>
            <Text style={styles.tableHeaderText}>{header}</Text>
          </View>
        ))}
      </View>
      <View style={styles.tableRow}>
        {values.map((val, index) => (
          <View key={index} style={styles.tableCell}>
            <Text style={styles.tableCellText}>{val}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderReport = () => {
    if (!reportData || !reportData.Results || reportData.Results.length === 0)
      return null;

    const result = reportData.Results[0];

    const apiStartDate = moment(result.s_date, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY/MM/DD HH:mm:ss"
    );
    const apiEndDate = moment(result.e_date, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY/MM/DD HH:mm:ss"
    );

    return (
      <View style={{ marginTop: 20 }}>
        <Text style={styles.sectionTitle}>
          {userName + " : " + apiStartDate + " to " + apiEndDate + " Report"}
        </Text>
        {renderTable(
          ["Accept Qty", "Accept Amount(Rs:)", "Delivery Qty"],
          [
            result.accept_qty_user,
            result.accept_amount_user,
            result.dly_qty_user,
          ]
        )}

        <Text style={styles.sectionTitle}>
          {result.poname +
            " : " +
            apiStartDate +
            " to " +
            apiEndDate +
            " All Report"}
        </Text>
        {renderTable(
          ["Accept Qty", "Accept Amount(Rs:)", "Delivery Qty"],
          [result.accept_qty, result.accept_amount, result.dly_qty]
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Report Type */}
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
          style={styles.dateButton}
          onPress={() => openPicker("date")}
        >
          <Text style={styles.dateButtonText}>
            Date: {moment(date).format("YYYY-MM-DD")}
          </Text>
        </TouchableOpacity>
      )}

      {selectedType === "range" && (
        <>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => openPicker("start")}
          >
            <Text style={styles.dateButtonText}>
              Start: {moment(startDate).format("YYYY-MM-DD")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => openPicker("end")}
          >
            <Text style={styles.dateButtonText}>
              End: {moment(endDate).format("YYYY-MM-DD")}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {selectedType === "daily" && (
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => openPicker("date")}
        >
          <Text style={styles.dateButtonText}>
            Date: {moment(date).format("YYYY-MM-DD")}
          </Text>
        </TouchableOpacity>
      )}

      {showPicker && (
        <DateTimePicker
          value={
            pickerMode === "date"
              ? date
              : pickerMode === "start"
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

      {/* Error Message */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Report Output */}
      {!loading && renderReport()}
    </ScrollView>
  );
};

export default ReportScreen;
