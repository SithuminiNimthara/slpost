// screens/SettingScreen.js
import { View, Text, TouchableOpacity } from "react-native";
import SmsSimPicker from "../components/SmsSimPicker";
import styles from "../styles/settingsStyles";

const Settings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SMS Settings</Text>
      <SmsSimPicker />
    </View>
  );
};

export default Settings;
