import { View } from "react-native";
import SmsSimPicker from "../components/SmsSimPicker";
import styles from "../styles/settingsStyles";

const Settings = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <SmsSimPicker />
      </View>
    </View>
  );
};

export default Settings;
