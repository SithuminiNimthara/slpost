import { Alert, PermissionsAndroid, Platform } from "react-native";
import { SendDirectSms } from "react-native-send-direct-sms";
import SmsListener from "react-native-android-sms-listener";

/**
 * Requests SMS-related permissions on Android.
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
 * Parses SMS response for tracking (slpt) or delivery (slpd)
 */
const parseResponse = (message) => {
  const patterns = [
    /slpa\s+(\w+).+?accepted\s+at\s+([\w\s-]+)/i,
    /slpd\s+(\w+).+?delivered\s+at\s+([\w\s-]+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.body.match(pattern);
    if (match) {
      return {
        barcode: match[1],
        location: match[2].trim(),
        fullMessage: message.body,
      };
    }
  }
  return null;
};

/**
 * Main SMS sending function.
 */
export const sendSms = async (type, params = {}) => {
  const phoneNumber = "1919";
  await requestSmsPermission();
  let message = "";

  switch (type) {
    case "slpa": {
      const { barcode, receiverName, weight, amount } = params;
      if (!barcode || !receiverName || !weight || !amount) {
        Alert.alert("Error", "Receiver Name, Weight, and Amount are required.");
        return;
      }
      const formattedReceiverName = receiverName.trim().replace(/\s+/g, "_");
      message = `pec slpa ${barcode} ${formattedReceiverName} ${weight} ${amount}`;
      break;
    }

    case "slpd": {
      const { barcode, deliveryOfficer, receiverSignature } = params;
      if (!barcode || !deliveryOfficer || !receiverSignature) {
        Alert.alert(
          "Error",
          "Barcode, User Name, and Location Name are required."
        );
        return;
      }
      const formattedOfficer = deliveryOfficer.trim().replace(/\s+/g, "_");
      const formattedSignature = receiverSignature.trim().replace(/\s+/g, "_");
      message = `pec slpd ${barcode} ${formattedOfficer} ${formattedSignature}`;
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

      return new Promise((resolve, reject) => {
        SendDirectSms(
          phoneNumber,
          message,
          () => {
            console.log("Report SMS sent successfully");
            Alert.alert("Success", "Report SMS sent!");
            resolve(true);
          },
          (error) => {
            console.error("Report SMS send failed:", error);
            Alert.alert("Failed", "Failed to send report SMS.");
            reject(error);
          }
        );
      });
    }

    default:
      Alert.alert("Error", "Invalid SMS type.");
      return;
  }

  // SMS types that expect a response
  return new Promise((resolve, reject) => {
    let listener;
    try {
      listener = SmsListener.addListener((sms) => {
        if (
          sms.originatingAddress === phoneNumber &&
          sms.body.toLowerCase().includes(params.barcode?.toLowerCase())
        ) {
          const parsed = parseResponse(sms.body);
          if (parsed) {
            listener.remove();
            resolve(parsed);
          }
        }
      });

      SendDirectSms(
        phoneNumber,
        message,
        () => console.log("SMS sent successfully"),
        (error) => {
          console.error("SMS send failed:", error);
          Alert.alert("Failed", "SMS sending failed.");
          listener?.remove();
          reject(error);
        }
      );

      setTimeout(() => {
        listener?.remove();
        reject(new Error("SMS response timeout"));
      }, 10000);
    } catch (error) {
      listener?.remove();
      reject(error);
    }
  });
};
