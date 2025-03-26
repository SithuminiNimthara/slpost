import * as SMS from "expo-sms";
import { Alert } from "react-native";

export const sendSms = async (barcode, receiverName, weight, amount) => {
  try {
    // Ensure fields are properly formatted
    if (!barcode || !receiverName || !weight || !amount) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    // Format message as required by 1919 gateway
    const message = `PEC SLPA ${barcode} ${receiverName} ${weight}g Rs.${amount}`;

    const phoneNumber = "1919"; // PEC SMS Gateway

    // Check if SMS is available
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert("Error", "SMS service is not available on this device.");
      return;
    }

    // Send SMS
    const { result } = await SMS.sendSMSAsync([phoneNumber], message, {
      allowAndroidSendWithoutReadPermission: true,
    });

    if (result === "sent") {
      Alert.alert("Success", "SMS sent successfully!");
    } else {
      Alert.alert("Cancelled", "SMS sending was cancelled.");
    }
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    Alert.alert("Error", "Failed to send SMS. Please try again.");
  }
};
