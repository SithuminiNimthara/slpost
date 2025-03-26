import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import eventMapping from "../utils/eventMapping";

const EventList = ({ barcode, itemDetails }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Events for: {barcode}</Text>
      <FlatList
        data={itemDetails}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.text}>
              Event {item.Eventid}:{"  "}
              {eventMapping[item.Eventid] || "Unknown Event"}
            </Text>
            <Text style={styles.text}>Date & Time: {item.Tdatetime}</Text>
            <Text style={styles.text}>Location: {item.location_name}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  header: { fontSize: 18, fontWeight: "bold" },
  eventItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  text: { fontSize: 16 },
});

export default EventList;
