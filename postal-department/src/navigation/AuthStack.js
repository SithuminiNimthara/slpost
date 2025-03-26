import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/LoginScreen";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#9C1D1D" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="Login" component={Login} options={{ title: "Postal Department" }} />
    </Stack.Navigator>
  );
}
