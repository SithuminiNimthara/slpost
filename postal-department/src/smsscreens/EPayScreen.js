import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const EcounterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridItem} onPress={() => {}}>
            <FontAwesome5 name="mobile-alt" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}>Mobitel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => {}}>
            <FontAwesome5 name="tint" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}>PMT</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => {}}>
            <FontAwesome5 name="bolt" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}>CEB</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => {}}>
            <FontAwesome5 name="file-alt" size={45} color="#9C1D1D" />
            <Text style={styles.gridText}>Report</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#9C1D1D",
    padding: 20,
    paddingTop: 50,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  gridItem: {
    width: "40%",
    backgroundColor: "#f4f4f4",
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

export default EcounterScreen;
