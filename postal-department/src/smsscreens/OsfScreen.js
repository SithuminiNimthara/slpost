import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { format, subDays } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import OffenceMap from "../components/OffenceMap";
import { OFFENCE_VALUES } from "../utils/offenceMap";
import styles from "../styles/smsosfStyles";
import { sendSms } from "../utils/sendEcounterSms"; // your SMS logic

const OSFSmsScreen = () => {
  const [drivingLicenseNo, setdrivingLicenseNo] = useState("");
  const [selectedOffences, setSelectedOffences] = useState([]);
  const [offenceDate, setOffenceDate] = useState("");
  const [policeCode, setPoliceCode] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

  useEffect(() => {
    const calculateTotalWithCharge = () => {
      let baseTotal = selectedOffences.reduce(
        (sum, id) => sum + (OFFENCE_VALUES[id] || 0),
        0
      );

      if (!offenceDate) return baseTotal.toString();

      const offence = new Date(`${new Date().getFullYear()}-${offenceDate}`);
      const today = new Date();
      const diffInDays = Math.ceil(
        Math.abs(today - offence) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays <= 14) {
        const total = baseTotal + 0.1 * baseTotal;
        return Math.round(total).toString();
      } else if (diffInDays <= 28) {
        const doubled = baseTotal * 2;
        const total = doubled + 0.1 * doubled;
        return Math.round(total).toString();
      } else {
        return baseTotal.toString();
      }
    };

    const updatedTotal = calculateTotalWithCharge();
    setTotalAmount(updatedTotal);
  }, [selectedOffences, offenceDate]);

  const toggleOffence = (number) => {
    setSelectedOffences((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number)
        : [...prev, number]
    );
  };

  const handleSubmit = async () => {
    setReplyMessage(null);

    if (
      !drivingLicenseNo ||
      selectedOffences.length === 0 ||
      !offenceDate ||
      !policeCode ||
      !totalAmount ||
      !customerMobile
    ) {
      setReplyMessage({
        status: "error",
        fullMessage: "All fields are required.",
        timestamp: new Date().toLocaleString(),
      });
      return;
    }

    if (isNaN(totalAmount) || Number(totalAmount) <= 0) {
      setReplyMessage({
        status: "error",
        fullMessage: "Total amount must be a valid positive number.",
        timestamp: new Date().toLocaleString(),
      });
      return;
    }

    const offences = selectedOffences.join(",");

    try {
      const reply = await sendSms("osf", {
        drivingLicenseNo,
        offences,
        offenceDate,
        policeCode,
        amount: totalAmount,
        mobile: customerMobile,
      });

      setReplyMessage(reply);
    } catch (error) {
      setReplyMessage({
        status: "error",
        fullMessage: error.message || "Failed to send or receive SMS.",
        timestamp: new Date().toLocaleString(),
      });
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const today = new Date();
      const pastLimit = subDays(today, 28);
      if (selectedDate >= pastLimit && selectedDate <= today) {
        const formatted = format(selectedDate, "MM-dd");
        setOffenceDate(formatted);
      } else {
        setReplyMessage({
          status: "error",
          fullMessage: "Only dates within the past 28 days are allowed.",
          timestamp: new Date().toLocaleString(),
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            {/* Driving License */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Driving License Number</Text>
              <TextInput
                style={styles.input}
                value={drivingLicenseNo}
                onChangeText={setdrivingLicenseNo}
                placeholder="e.g., A12345"
                autoCapitalize="characters"
                placeholderTextColor="#999"
              />
            </View>

            {/* Offence Selection */}
            <Text style={[styles.label, { marginTop: 16 }]}>
              Select Offence Number(s)
            </Text>
            <OffenceMap
              selectedOffences={selectedOffences}
              onToggle={toggleOffence}
            />

            {/* Offence Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Offence Date (MM-DD)</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: offenceDate ? "#222" : "#999", fontSize: 16 }}>
                  {offenceDate || "Select date"}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={subDays(new Date(), 28)}
                />
              )}
            </View>

            {/* Police Code */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Police Code</Text>
              <TextInput
                style={styles.input}
                value={policeCode}
                onChangeText={setPoliceCode}
                placeholder="Enter Police Code"
                placeholderTextColor="#999"
                autoCapitalize="characters"
                maxLength={4}
              />
            </View>

            {/* Total Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Amount (Rs)</Text>
              <TextInput
                style={styles.input}
                value={totalAmount}
                editable={false}
                placeholder="Auto-calculated"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              {selectedOffences.length > 0 && totalAmount && (
                <Text style={styles.breakdownText}>
                  {(() => {
                    const base = selectedOffences.reduce(
                      (sum, id) => sum + (OFFENCE_VALUES[id] || 0),
                      0
                    );
                    const total = parseFloat(totalAmount);
                    const diff = total - base;
                    const offence = new Date(`${new Date().getFullYear()}-${offenceDate}`);
                    const today = new Date();
                    const diffInDays = Math.ceil(
                      Math.abs(today - offence) / (1000 * 60 * 60 * 24)
                    );

                    if (diffInDays <= 14) {
                      return `Base: Rs ${base} + 10% Late Fee = Rs ${Math.round(0.1 * base)}`;
                    } else if (diffInDays <= 28) {
                      const doubled = base * 2;
                      return `Base x2: Rs ${doubled} + 10% Fee = Rs ${Math.round(0.1 * doubled)}`;
                    } else {
                      return `Base: Rs ${base}`;
                    }
                  })()}
                </Text>
              )}
            </View>

            {/* Mobile No */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Customer Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={customerMobile}
                onChangeText={setCustomerMobile}
                placeholder="e.g., 0712345678"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {/* Submit */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Send SMS</Text>
            </TouchableOpacity>

            {/* Reply Box */}
            {replyMessage && (
              <View style={styles.replyBox}>
                <Text style={styles.replyTitle}>
                  Reply from 1919 ({replyMessage.status}):
                </Text>
                <Text style={styles.replyText}>{replyMessage.fullMessage}</Text>
                <Text style={styles.replyTime}>
                  {replyMessage.timestamp}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default OSFSmsScreen;
