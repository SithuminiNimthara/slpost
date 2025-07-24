import React from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { OFFENCE_VALUES } from "../utils/offenceMap";

const OFFENCE_LIST = Object.keys(OFFENCE_VALUES);

const OffenceMap = ({ selectedOffences, onToggle }) => {
  const renderOffenceItem = ({ item }) => {
    const selected = selectedOffences.includes(item);
    const value = OFFENCE_VALUES[item];

    return (
      <TouchableOpacity
        style={[styles.offenceItem, selected && styles.offenceItemSelected]}
        onPress={() => onToggle(item)}
      >
        <MaterialIcons
          name={selected ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={selected ? "#9C1D1D" : "#777"}
        />
        <Text style={styles.offenceText}>
          {item} - Rs.{value}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={OFFENCE_LIST}
      renderItem={renderOffenceItem}
      keyExtractor={(item) => item}
      numColumns={3}
      scrollEnabled={false}
      contentContainerStyle={{ marginVertical: 10 }}
    />
  );
};

const styles = StyleSheet.create({
  offenceItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "30%",
    marginVertical: 6,
    marginRight: 10,
  },
  offenceItemSelected: {
    backgroundColor: "#f9eaea",
    borderRadius: 8,
    padding: 4,
  },
  offenceText: {
    marginLeft: 6,
    color: "#333",
    fontSize: 14,
  },
});

export default OffenceMap;
