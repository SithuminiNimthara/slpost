import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const SMSMenuScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("SLPMailSMS")}
          >
            <FontAwesome5 name="envelope" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}>SLP Mail</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("SMSECounter")}
          >
            <FontAwesome5 name="desktop" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}>E Counter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("SMSEPay")}
          >
            <FontAwesome5 name="money-check-alt" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}>E Pay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 50,
    marginTop: 20,
  },
  gridItem: {
    width: "40%",
    backgroundColor: "#eee",
    margin: 10,
    padding: 25,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  gridText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#9C1D1D",
  },
});

export default SMSMenuScreen;
