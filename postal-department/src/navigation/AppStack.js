import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Dashboard from "../screens/HomeScreen";
import SLPMail from "../screens/SLPMailScreen";
import TrackItem from "../screens/TrackItemScreen";
import AcceptanceForm from "../screens/AcceptanceFormScreen";
import SMSAcceptance from "../screens/SMSAcceptanceScreen";
import SMSDelivery from "../screens/SMSDeliveryScreen";
import Settings from "../screens/SettingScreen";
import HeaderRight from "../components/HeaderRight"; // Adjust path as needed

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#9C1D1D" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
        // Remove headerRight from here!
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: "Department Service",
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="SLPMail"
        component={SLPMail}
        options={{
          title: "SLP Mail Service",
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="TrackItem"
        component={TrackItem}
        options={{
          title: "Item Tracking",
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="AcceptanceForm"
        component={AcceptanceForm}
        options={{
          title: "Acceptance",
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="SMSAcceptance"
        component={SMSAcceptance}
        options={{
          title: "SMS Acceptance",
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="SMSDelivery"
        component={SMSDelivery}
        options={{
          title: "SMS Delivery",
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          title: "Settings",
          headerRight: () => <HeaderRight />,
        }}
      />
    </Stack.Navigator>
  );
}
