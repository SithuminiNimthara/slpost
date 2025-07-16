import {
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { SendDirectSms } from "react-native-send-direct-sms";
import SmsListener from "react-native-android-sms-listener";

const SMS_GATEWAY = "1919";

/**
 * Request SMS permissions.
 */
const requestSmsPermissions = async () => {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    ]);

    const allGranted = Object.values(granted).every(
      (res) => res === PermissionsAndroid.RESULTS.GRANTED
    );

    if (!allGranted) {
      Alert.alert(
        "Permission Required",
        "SMS permissions are required to send and read replies."
      );
      return false;
    }
  }

  return true;
};

/**
 * Constructs message based on service type and parameters.
 */
const constructMessage = (type, params) => {
  switch (type) {
    case "water": {
      const { acct, amount, mobileNo } = params;
      return `pec wbp ${acct} ${amount} ${mobileNo}`;
    }
    case "kmc_assessment": {
      const { taxNo, amount, customerMobileNo } = params;
      return `pec kas ${taxNo} ${amount} ${customerMobileNo}`;
    }
    case "kmc_waterbill": {
      const { acctNo, amount, customerMobileNo } = params;
      return `pec kwb ${acctNo} ${amount} ${customerMobileNo}`;
    }
    case "cyl": {
      const { policyNumber, nicLast6, amount, contactNumber } = params;
      return `pec cyl ${policyNumber} ${nicLast6} ${amount} ${contactNumber}`;
    }
    case "slt": {
      const { sltNumber, amount, contactNumber } = params;
      return `pec slt ${sltNumber} ${amount} ${contactNumber}`;
    }
    case "exam": {
      const { refNo, verificationCode, amount } = params;
      return `pec slt ${refNo} ${verificationCode} ${amount}`;
    }
    case "rpt":
    case "report": {
      const { reportType, date, startDate, endDate } = params;
      if (reportType === "daily") {
        return "pec rpt";
      } else if (reportType === "date") {
        return `pec rpt ${date}`;
      } else if (reportType === "range") {
        return `pec rpt ${startDate} ${endDate}`;
      } else {
        throw new Error("Invalid report type");
      }
    }
    default:
      throw new Error("Unknown SMS type");
  }
};

/**
 * Sends SMS and listens for a reply from 1919.
 */
export const sendSms = async (type, params = {}) => {
  const hasPermission = await requestSmsPermissions();
  if (!hasPermission) return;

  let message;
  try {
    message = constructMessage(type, params);
  } catch (error) {
    Alert.alert("Error", error.message);
    return;
  }

  return new Promise((resolve, reject) => {
    let listener;

    try {
      // Start SMS listener for reply from 1919
      listener = SmsListener.addListener((sms) => {
        if (sms?.originatingAddress?.includes("1919")) {
          const reply = {
            fullMessage: sms.body.trim(),
            timestamp: new Date().toLocaleString(),
            status: "success",
          };
          listener.remove();
          resolve(reply);
        }
      });

      // Send SMS silently
      SendDirectSms(
        SMS_GATEWAY,
        message,
        () => {
          console.log("SMS sent:", message);
          Alert.alert("Success", "SMS sent successfully. Awaiting reply...");
        },
        (error) => {
          console.error("SMS sending failed:", error);
          Alert.alert("Failed", "SMS sending failed.");
          listener?.remove();
          reject(error);
        }
      );

      // Timeout after 90 seconds if no reply
      setTimeout(() => {
        listener?.remove();
        reject(new Error("SMS response timeout from 1919"));
      }, 90000);
    } catch (err) {
      listener?.remove();
      reject(err);
    }
  });
};
