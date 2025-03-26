import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import styles from "../styles/slpMailStyles";

const SLPMail = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("AcceptanceForm")}
          >
            <FontAwesome5 name="inbox" size={24} color="#9C1D1D" />
            <Text style={styles.gridText}>Acceptance</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => {}}>
            <FontAwesome5 name="file-alt" size={24} color="#9C1D1D" />
            <Text style={styles.gridText}>Mark Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("TrackItem")}
          >
            <FontAwesome5 name="map-marker-alt" size={24} color="#9C1D1D" />
            <Text style={styles.gridText}>Tracking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => {}}>
            <FontAwesome5 name="chart-bar" size={24} color="#9C1D1D" />
            <Text style={styles.gridText}>Report</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => {}}>
            <FontAwesome5 name="shipping-fast" size={24} color="#9C1D1D" />
            <Text style={styles.gridText}>Dispatch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => {}}>
            <FontAwesome5 name="route" size={24} color="#9C1D1D" />
            <Text style={styles.gridText}>Add Beat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => {}}>
            <FontAwesome5 name="truck" size={24} color="#9C1D1D" />
            <Text style={styles.gridText}>Delivery</Text>
          </TouchableOpacity>
        </View>

        {/* Line Separator */}
        <View style={styles.separator}></View>

        {/* SMS Features */}
        <Text style={styles.smsSectionTitle}>SMS Features</Text>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("SMSAcceptance")}
          >
            <FontAwesome5 name="comment-alt" size={24} color="#9C1D1D" />
            <Text style={styles.gridText}>SMS Acceptance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gridItem}
            onPress={() => navigation.navigate("SMSDelivery")}
          >
            <FontAwesome5 name="sms" size={24} color="#9C1D1D" />
            <Text style={styles.gridText}>SMS Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => {}}>
            <FontAwesome5 name="map-marked-alt" size={24} color="#9C1D1D" />
            <Text style={styles.gridText}>SMS Tracking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => {}}>
            <FontAwesome5 name="file-invoice" size={24} color="#9C1D1D" />
            <Text style={styles.gridText}>SMS Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SLPMail;
