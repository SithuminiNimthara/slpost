import { Alert, PermissionsAndroid, Platform } from "react-native";
import { SendDirectSms } from "react-native-send-direct-sms";
import SmsListener from "react-native-android-sms-listener";

const phoneNumber = "1919";

/**
 * Requests SMS permissions on Android.
 */
const requestSmsPermission = async () => {
  if (Platform.OS === "android") {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    ]);
  }
};

/**
 * Main function to send SMS and receive reply.
 */
export const sendSms = async (type, params = {}) => {
  await requestSmsPermission();
  let message = "";

  // Construct the SMS based on type
  switch (type) {
    case "slpa": {
      const { barcode, receiverName, contact_no, weight, amount } = params;
      if (!barcode || !receiverName || !contact_no || !weight || !amount) {
        Alert.alert(
          "Error",
          "Receiver Name, Contact Number, Weight, and Amount are required."
        );
        return;
      }
      const formattedName = receiverName.trim().replace(/\s+/g, "_");
      message = `pec slpa ${barcode} ${formattedName} ${contact_no} ${weight} ${amount}`;
      break;
    }

    case "slpd": {
      const { barcode } = params;
      if (!barcode) {
        Alert.alert("Error", "Barcode is required.");
        return;
      }
      message = `pec slpd ${barcode}`;
      break;
    }

    case "slpt": {
      const { barcode } = params;
      if (!barcode) {
        Alert.alert("Error", "Barcode number is required!");
        return;
      }
      message = `pec slpt ${barcode}`;
      break;
    }

    case "slpr": {
      const { reportType, date, startDate, endDate } = params;

      if (reportType === "daily") {
        message = "pec slpr";
      } else if (reportType === "date") {
        if (!date) {
          Alert.alert("Error", "Please enter the date.");
          return;
        }
        message = `pec slpr ${date}`;
      } else if (reportType === "range") {
        if (!startDate || !endDate) {
          Alert.alert("Error", "Please enter both start and end dates.");
          return;
        }
        message = `pec slpr ${startDate} ${endDate}`;
      } else {
        Alert.alert("Error", "Invalid report type.");
        return;
      }
      break;
    }

    default:
      Alert.alert("Error", "Invalid SMS type.");
      return;
  }

  return new Promise((resolve, reject) => {
    let listener;

    try {
      // Start listening for SMS replies
      listener = SmsListener.addListener((sms) => {
        const fromExpectedNumber = sms.originatingAddress.includes("1919");

        if (fromExpectedNumber) {
          const reply = {
            fullMessage: sms.body.trim(),
            timestamp: new Date().toLocaleString(),
            status: "success",
          };
          listener.remove(); // stop listening
          resolve(reply);
        }
      });

      // Send SMS
      SendDirectSms(
        phoneNumber,
        message,
        () => {
          console.log("SMS sent successfully");
          Alert.alert("Success", "SMS sent successfully.");
        },
        (error) => {
          console.error("SMS failed:", error);
          Alert.alert("Failed", "SMS sending failed.");
          listener?.remove();
          reject(error);
        }
      );

      // Timeout after 90 seconds
      setTimeout(() => {
        listener?.remove();
        reject(new Error("SMS response timeout"));
      }, 90000);
    } catch (err) {
      listener?.remove();
      reject(err);
    }
  });
};
