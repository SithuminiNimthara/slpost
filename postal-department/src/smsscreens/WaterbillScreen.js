import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { sendSms } from "../utils/sendEcounterSms";
import styles from "../styles/smswaterbillStyles";

// Format input as 12/14/123/345/12
const formatAccountNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 12);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 4),
    digits.slice(4, 7),
    digits.slice(7, 10),
    digits.slice(10, 12),
  ];
  return parts.filter(Boolean).join("/");
};

const WaterBillSmsScreen = () => {
  const [acct, setAcct] = useState("");
  const [confirmAcct, setConfirmAcct] = useState("");
  const [amount, setAmount] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [replyMsg, setReplyMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const acctInputRef = useRef(null);

  const isAcctMatching =
    acct.replace(/\D/g, "") === confirmAcct.replace(/\D/g, "");

  const totalWithCharge =
    amount && !isNaN(amount) && Number(amount) >= 21
      ? (Number(amount) + 20).toFixed(2)
      : null;

  // 🔍 Handle Search Button
  const handleSearch = async () => {
    const rawAcct = acct.replace(/\D/g, "");
    const rawConfirmAcct = confirmAcct.replace(/\D/g, "");

    if (!rawAcct || !rawConfirmAcct) {
      return alert("Please enter and confirm account number.");
    }

    if (rawAcct.length !== 12) {
      return alert("Account Number must contain exactly 12 digits.");
    }

    if (rawAcct !== rawConfirmAcct) {
      return alert("Account numbers do not match.");
    }

    try {
      setLoading(true);
      setReplyMsg("");

      const response = await sendSms("wbi", {
        acct: rawAcct,
      });

      if (response?.status === "success") {
        setReplyMsg(response.fullMessage);
      } else {
        setReplyMsg("SMS sent but no reply received.");
      }
    } catch (error) {
      setReplyMsg(error.message || "Failed to send SMS.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Submit Button
  const handleSubmit = async () => {
    const rawAcct = acct.replace(/\D/g, "");
    const rawConfirmAcct = confirmAcct.replace(/\D/g, "");

    if (!rawAcct || !rawConfirmAcct || !amount || !mobileNo) {
      return alert("All fields are required.");
    }

    if (rawAcct.length !== 12) {
      return alert("Account Number must contain exactly 12 digits.");
    }

    if (rawAcct !== rawConfirmAcct) {
      return alert("Account numbers do not match.");
    }

    if (!/^\d{10}$/.test(mobileNo)) {
      return alert("Mobile Number must be exactly 10 digits.");
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount)) {
      return alert("Amount must be a number.");
    }

    if (numAmount < 21) {
      return alert("Amount must be at least Rs. 21.");
    }

    try {
      setLoading(true);
      setReplyMsg("");

      const response = await sendSms("water", {
        acct: rawConfirmAcct,
        amount: totalWithCharge ? Number(totalWithCharge) : null,
        mobileNo,
      });

      if (response?.status === "success") {
        setReplyMsg(response.fullMessage);
      } else {
        setReplyMsg("SMS sent but no reply received.");
      }
    } catch (error) {
      setReplyMsg(error.message || "Failed to send SMS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* Account Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                ref={acctInputRef}
                style={styles.input}
                value={acct}
                onChangeText={(text) => setAcct(formatAccountNumber(text))}
                placeholder="e.g., 12/14/123/345/12"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={16}
                secureTextEntry={isConfirming}
              />
            </View>

            {/* Confirm Account Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Account Number</Text>
              <TextInput
                style={[
                  styles.input,
                  confirmAcct.length === 16 &&
                    !isAcctMatching &&
                    styles.inputError,
                ]}
                value={confirmAcct}
                onChangeText={(text) =>
                  setConfirmAcct(formatAccountNumber(text))
                }
                onFocus={() => setIsConfirming(true)}
                onBlur={() => setIsConfirming(false)}
                placeholder="e.g., 12/14/123/345/12"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={16}
              />

              {!isAcctMatching && confirmAcct.length === 16 && (
                <Text style={styles.matchWarning}>
                  Account numbers do not match.
                </Text>
              )}

              {/* Search button aligned to the right side */}
              <View style={styles.searchButtonWrapper}>
                <TouchableOpacity
                  style={styles.searchButtonSmall}
                  onPress={handleSearch}
                  disabled={loading}
                >
                  <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Amount + Total */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (Rs)</Text>
              <View style={styles.amountRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginRight: 10 }]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="e.g., 100"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  editable={!!replyMsg}
                />
                {totalWithCharge && (
                  <View style={styles.totalBox}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>Rs. {totalWithCharge}</Text>
                  </View>
                )}
              </View>
              {amount !== "" && !isNaN(amount) && Number(amount) < 21 && (
                <Text style={styles.maxAmountWarning}>
                  Amount must be at least Rs. 21.
                </Text>
              )}
            </View>

            {/* Mobile Number */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={mobileNo}
                onChangeText={setMobileNo}
                placeholder="e.g., 07XXXXXXXX"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={10}
                editable={!!replyMsg}
              />
            </View>

            {/* Spinner */}
            {loading && (
              <View style={styles.spinnerContainer}>
                <ActivityIndicator size="large" color="#9C1D1D" />
                <Text style={styles.loadingText}>Waiting for SMS reply...</Text>
              </View>
            )}

            {/* Send SMS */}
            <TouchableOpacity
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Send SMS</Text>
            </TouchableOpacity>

            {/* Reply Message */}
            {replyMsg !== "" && (
              <View style={styles.replyBox}>
                <Text style={styles.replyTitle}>Reply from 1919:</Text>
                <Text style={styles.replyText}>{replyMsg}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default WaterBillSmsScreen;
