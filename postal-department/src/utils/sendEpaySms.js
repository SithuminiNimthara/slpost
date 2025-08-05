import { Alert, PermissionsAndroid, Platform } from "react-native";
import { SendDirectSms } from "react-native-send-direct-sms";
import SmsListener from "react-native-android-sms-listener";

const SMS_GATEWAY = "1919";

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

const constructEpayMessage = (params) => {
  const { pinNo, subType } = params;

  switch (subType) {
    case "MOBITEL": // post epay pinNo MB amount mobileNo
      return `post epay ${pinNo} MB ${params.amount} ${params.mobileNo} `;
    case "CEB": // post epay pinNo EB amount zone accountNo
      return `post epay ${pinNo} EB ${params.amount} ${params.zone} ${params.accountNo}`;

    case "PMT_ACCEPT": // post epay pinNo mmt amount RName SName
      return `post epay ${pinNo} mmt ${params.amount} ${params.RName} ${params.SName}`;

    case "PMT_PAYMENT": // post epay pinNo mmp PMTNo NIC
      return `post epay ${pinNo} mmp ${params.PMTNo} ${params.NIC}`;

    case "PMT_DELETE": // post epay pinNo com PMTNo reason
      return `post epay ${pinNo} com ${params.PMTNo} ${params.reason}`;

    case "REPORT": // post epay sum date range
      return `post epay sum ${params.date} ${params.range}`;

    default:
      throw new Error("Invalid epay subType");
  }
};

export const sendSms = async (params) => {
  const hasPermission = await requestSmsPermissions();
  if (!hasPermission) return;

  let message;
  try {
    message = constructEpayMessage(params);
  } catch (error) {
    Alert.alert("Error", error.message);
    return;
  }

  return new Promise((resolve, reject) => {
    let listener;

    try {
      // Listen for reply SMS from 1919
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
