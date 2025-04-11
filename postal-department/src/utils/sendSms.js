import * as SMS from "expo-sms";
import { Alert } from "react-native";

export const sendSms = async (barcode, receiverName, weight, amount) => {
  try {
    let message = "";
    const phoneNumber = "1919"; // PEC SMS Gateway

    if (barcode && receiverName && weight && amount) {
      // Format message for full details
      message = `pec slpa ${barcode} ${receiverName} ${weight} ${amount}`;
    } else if (barcode) {
      // Format message when only barcode is provided
      message = `pec slpa ${barcode}`;
    } else {
      Alert.alert("Error", "Barcode number is required!");
      return;
    }

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
