import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/formStyles";
import { Picker } from "@react-native-picker/picker";

const DropdownInput = ({ name, value, onChange }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>Company Type:</Text>
    <Picker
      selectedValue={value}
      onValueChange={(itemValue) => onChange(name, itemValue)}
      style={styles.input}
    >
      <Picker.Item label="Normal" value="normal" />
      <Picker.Item
        label="Government Department"
        value="government_department"
      />
    </Picker>
  </View>
);

export default DropdownInput;
