import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const SLPMailSMS = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("SMSAcceptance")}
          >
            <FontAwesome5 name="inbox" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}> Acceptance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("SMSDelivery")}
          >
            <FontAwesome5 name="paper-plane" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}> Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("SMSTracking")}
          >
            <FontAwesome5 name="search" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}> Tracking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("SMSReport")}
          >
            <FontAwesome5 name="file-alt" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}> Reports</Text>
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
    marginTop: 8,
  },
});

export default SLPMailSMS;
