import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SMSMenuScreen from "../smsscreens/SMSMenuScreen";
import SLPMailSMS from "../smsscreens/SLPMailSMSScreen";
import SMSAcceptance from "../smsscreens/AcceptanceScreen";
import SMSDelivery from "../smsscreens/DeliveryScreen";
import SMSTracking from "../smsscreens/TrackingScreen";
import SMSReport from "../smsscreens/ReportScreen";
import SMSECounter from "../smsscreens/ECounterScreen";
import SMSEPay from "../smsscreens/EPayScreen";
import CeylincoSms from "../smsscreens/CeylincoScreen";
import SltSms from "../smsscreens/SltScreen";
import ExamSms from "../smsscreens/ExamScreen";
import WaterBillSms from "../smsscreens/WaterbillScreen";
import KmcPaymentSms from "../smsscreens/KmcPaymentScreen";
import McounterReportSms from "../smsscreens/McounterReportScreen";
import OSFSms from "../smsscreens/OsfScreen";

const Stack = createStackNavigator();

export default function SMSStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#9C1D1D" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="SMSMenuScreen"
        component={SMSMenuScreen}
        options={{ title: "Department SMS Services" }}
      />
      <Stack.Screen
        name="SLPMailSMS"
        component={SLPMailSMS}
        options={{ title: "SLP Mail" }}
      />
      <Stack.Screen
        name="SMSAcceptance"
        component={SMSAcceptance}
        options={{ title: "SMS Acceptance" }}
      />
      <Stack.Screen
        name="SMSDelivery"
        component={SMSDelivery}
        options={{ title: "SMS Delivery" }}
      />
      <Stack.Screen
        name="SMSTracking"
        component={SMSTracking}
        options={{ title: "SMS Tracking" }}
      />
      <Stack.Screen
        name="SMSReport"
        component={SMSReport}
        options={{ title: "SMS Report" }}
      />

      <Stack.Screen
        name="SMSECounter"
        component={SMSECounter}
        options={{ title: "mcounter" }}
      />

      <Stack.Screen
        name="SMSEPay"
        component={SMSEPay}
        options={{ title: "mepay" }}
      />

      <Stack.Screen
        name="CeylincoSms"
        component={CeylincoSms}
        options={{ title: "Ceylinco" }}
      />

      <Stack.Screen
        name="SltSms"
        component={SltSms}
        options={{ title: "SLT" }}
      />

      <Stack.Screen
        name="ExamSms"
        component={ExamSms}
        options={{ title: "Exam" }}
      />

      <Stack.Screen
        name="WaterBillSms"
        component={WaterBillSms}
        options={{ title: "Water Bill" }}
      />

      <Stack.Screen
        name="KMCPaymentSms"
        component={KmcPaymentSms}
        options={{ title: "KMC Payment" }}
      />

      <Stack.Screen
        name="McounterReportSms"
        component={McounterReportSms}
        options={{ title: "Mcounter Report" }}
      />

      <Stack.Screen
        name="OsfSms"
        component={OSFSms}
        options={{ title: "OSF SMS" }}
      />
    </Stack.Navigator>
  );
}
