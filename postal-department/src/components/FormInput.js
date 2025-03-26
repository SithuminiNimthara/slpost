import React from "react";
import { View, Text, TextInput } from "react-native";
import styles from "../styles/formStyles";

const FormInput = ({ label, name, value, onChange, keyboardType, readOnly }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}:</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={(text) => onChange(name, text)}
      keyboardType={keyboardType || "default"}
      editable={!readOnly}
    />
  </View>
);

export default FormInput;
