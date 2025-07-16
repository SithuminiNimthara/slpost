import React from "react";
import { View, Text, TextInput } from "react-native";
import styles from "../styles/formStyles";
const FormInput = ({
  label,
  name,
  value,
  onChange,
  keyboardType,
  readOnly,
  required = false,
  errorMessage = "",
  placeholder,
  autoCapitalize = "none", // ✅ default to "none"
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>
      {label}
      {required && <Text style={{ color: "red" }}> *</Text>}:
    </Text>
    <TextInput
      style={[
        styles.input,
        errorMessage ? { borderColor: "red", borderWidth: 1 } : null,
      ]}
      value={value}
      onChangeText={(text) => onChange(name, text)}
      keyboardType={keyboardType || "default"}
      editable={!readOnly}
      placeholder={placeholder}
      placeholderTextColor="#999"
      autoCorrect={false}
      autoCapitalize={autoCapitalize} // ✅ dynamic
    />
    {errorMessage ? (
      <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
        {errorMessage}
      </Text>
    ) : null}
  </View>
);

export default FormInput;
