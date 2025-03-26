import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "../screens/HomeScreen";
import SLPMail from "../screens/SLPMailScreen";
import TrackItem from "../screens/TrackItemScreen";
import AcceptanceForm from "../screens/AcceptanceFormScreen";
import SMSAcceptance from "../screens/SMSAcceptanceScreen";
import SMSDelivery from "../screens/SMSDeliveryScreen";
import Settings from "../screens/SettingScreen";

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#9C1D1D" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ title: "Department Service" }}
      />
      <Stack.Screen
        name="SLPMail"
        component={SLPMail}
        options={{ title: "SLP Mail Service" }}
      />
      <Stack.Screen
        name="TrackItem"
        component={TrackItem}
        options={{ title: "Item Tracking" }}
      />
      <Stack.Screen
        name="AcceptanceForm"
        component={AcceptanceForm}
        options={{ title: "Acceptance" }}
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
        name="Settings"
        component={Settings}
        options={{ title: "Settings" }}
      />
    </Stack.Navigator>
  );
}
