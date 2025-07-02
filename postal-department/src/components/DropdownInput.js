import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/formStyles";
import { Picker } from "@react-native-picker/picker";

const DropdownInput = ({
  label = "Company Type",
  name,
  value,
  onChange,
  required = false,
  errorMessage = "",
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>
      {label}
      {required && <Text style={{ color: "red" }}> *</Text>}:
    </Text>

    <Picker
      selectedValue={value}
      onValueChange={(itemValue) => onChange(name, itemValue)}
      style={[
        styles.input,
        errorMessage ? { borderColor: "red", borderWidth: 1 } : null,
      ]}
    >
      <Picker.Item label="Normal" value="normal" />
      <Picker.Item
        label="Government Department"
        value="government_department"
      />
    </Picker>

    {errorMessage ? (
      <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
        {errorMessage}
      </Text>
    ) : null}
  </View>
);

export default DropdownInput;
