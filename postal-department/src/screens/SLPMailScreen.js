import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import styles from "../styles/slpMailStyles";

const SLPMail = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.gridContainer}>
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate("AcceptanceForm")}
            >
              <FontAwesome5 name="inbox" size={45} color="#9C1D1D" />
              <Text style={styles.gridText}>Acceptance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate("TrackItem")}
            >
              <FontAwesome5 name="map-marker-alt" size={45} color="#9C1D1D" />
              <Text style={styles.gridText}>Tracking</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate("Delivery")}
            >
              <FontAwesome5 name="truck" size={45} color="#9C1D1D" />
              <Text style={styles.gridText}>Delivery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate("Undelivery")}
            >
              <FontAwesome5 name="box-open" size={45} color="#9C1D1D" />
              <Text style={styles.gridText}>Undelivery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate("AddBeat")}
            >
              <FontAwesome5 name="route" size={45} color="#9C1D1D" />
              <Text style={styles.gridText}>Add Beat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => navigation.navigate("Report")}
            >
              <FontAwesome5 name="chart-bar" size={45} color="#9C1D1D" />
              <Text style={styles.gridText}>Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default SLPMail;
