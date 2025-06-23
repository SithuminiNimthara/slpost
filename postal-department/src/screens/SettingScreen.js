// screens/SettingScreen.js
import { View, Text } from "react-native";
import SmsSimPicker from "../components/SmsSimPicker";
import styles from "../styles/settingsStyles";

const Settings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SMS Settings</Text>
      <View style={styles.card}>
        <SmsSimPicker />
      </View>
    </View>
  );
};

export default Settings;
