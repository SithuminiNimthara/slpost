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
  placeholder, // ✅ add placeholder prop
}) => (
  <View style={styles.inputContainer}> 
    {/* Label with red asterisk */}
    <Text style={styles.label}>
      {label}
      {required && <Text style={{ color: "red" }}> *</Text>}:
    </Text>

    {/* Input field */}
    <TextInput
      style={[
        styles.input,
        errorMessage ? { borderColor: "red", borderWidth: 1 } : null,
      ]}
      value={value}
      onChangeText={(text) => onChange(name, text)}
      keyboardType={keyboardType || "default"}
      editable={!readOnly}
      placeholder={placeholder} // ✅ pass placeholder here
      placeholderTextColor="#999" // ✅ optional: for visibility
    />

    {/* Optional error message below input */}
    {errorMessage ? (
      <Text style={{ color: "red", fontSize: 12, marginTop: 4 }}>
        {errorMessage}
      </Text>
    ) : null}
  </View>
);

export default FormInput;
