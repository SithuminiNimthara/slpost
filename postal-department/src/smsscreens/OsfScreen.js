import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
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

const OSFSmsScreen = () => {
  const [drivingLicenseNo, setdrivingLicenseNo] = useState("");
  const [selectedOffences, setSelectedOffences] = useState([]);
  const [offenceDate, setOffenceDate] = useState("");
  const [policeCode, setPoliceCode] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const calculateTotalWithCharge = () => {
      let baseTotal = selectedOffences.reduce(
        (sum, id) => sum + (OFFENCE_VALUES[id] || 0),
        0
      );

      if (!offenceDate) {
        return baseTotal.toString();
      }

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
        // Outside allowed range — fallback
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
    if (
      !drivingLicenseNo ||
      selectedOffences.length === 0 ||
      !offenceDate ||
      !policeCode ||
      !totalAmount ||
      !customerMobile
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
      await sendSms("osf", {
        drivingLicenseNo,
        offences,
        offenceDate,
        policeCode,
        amount: totalAmount,
        mobile: customerMobile,
      });

      Alert.alert("Success", "SMS sent. Awaiting reply.");
    } catch (error) {
      Alert.alert("Error", "Failed to send SMS.");
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
        Alert.alert(
          "Invalid Date",
          "Only dates within the past 28 days are allowed."
        );
      }
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

            <Text style={[styles.label, { marginTop: 16 }]}>
              Select Offence Number(s)
            </Text>

            <OffenceMap
              selectedOffences={selectedOffences}
              onToggle={toggleOffence}
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
                  maximumDate={new Date()}
                  minimumDate={subDays(new Date(), 28)}
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
                maxLength={4}
              />
            </View>

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
              {/* Show breakdown if offences selected */}
              {selectedOffences.length > 0 && totalAmount && (
                <Text style={styles.breakdownText}>
                  {(() => {
                    const baseTotal = selectedOffences.reduce(
                      (sum, id) => sum + (OFFENCE_VALUES[id] || 0),
                      0
                    );
                    const total = parseFloat(totalAmount);
                    const diff = total - baseTotal;

                    const offence = new Date(
                      `${new Date().getFullYear()}-${offenceDate}`
                    );
                    const today = new Date();
                    const diffInDays = Math.ceil(
                      Math.abs(today - offence) / (1000 * 60 * 60 * 24)
                    );

                    if (diffInDays <= 14) {
                      return `Base: Rs ${baseTotal} + Fee: Rs ${Math.round(
                        0.1 * baseTotal
                      )} (10% late fee)`;
                    } else if (diffInDays <= 28) {
                      const doubled = baseTotal * 2;
                      const extra = 0.1 * doubled;
                      return `Base x2: Rs ${doubled} + Fee: Rs ${Math.round(
                        extra
                      )} (10% on doubled)`;
                    } else {
                      return `Base: Rs ${baseTotal}`;
                    }
                  })()}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Customer Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={customerMobile}
                onChangeText={setCustomerMobile}
                placeholder="e.g., 0123456789"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={10}
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

export default OSFSmsScreen;
