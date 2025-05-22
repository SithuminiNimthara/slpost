import { SendDirectSms } from "react-native-send-direct-sms";
import { Alert } from "react-native";

export const sendSms = async (barcode, receiverName, weight, amount) => {
  try {
    let message = "";
    const phoneNumber = "1919"; // PEC SMS Gateway

    // Validate barcode input
    if (!barcode) {
      Alert.alert("Error", "Barcode number is required!");
      return;
    }

    // Format message based on provided details
    if (receiverName && weight && amount) {
      message = `pec slpa ${barcode} ${receiverName} ${weight} ${amount}`;
    } else {
      message = `pec slpa ${barcode}`;
    }

    console.log("Calling SendDirectSms now...");

    // Send SMS directly
    SendDirectSms(
      phoneNumber,
      message,
      (success) => {
        console.log("SMS Sent?", success);
        Alert.alert("Success", "SMS sent directly!");
      },
      (error) => {
        console.error("SMS Error Callback:", error);
        Alert.alert("Failed", "SMS sending failed.");
      }
    );
  } catch (error) {
    console.error("Error sending SMS:", error);
    Alert.alert("Error", "Failed to send SMS. Please try again.");
  }
};
