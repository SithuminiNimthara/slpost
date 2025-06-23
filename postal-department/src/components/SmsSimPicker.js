// components/SmsSimPicker.js
import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getSimData } from "react-native-sim-data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/settingsStyles";

const SmsSimPicker = () => {
  const [simOptions, setSimOptions] = useState([]);
  const [selectedSim, setSelectedSim] = useState(null);

  useEffect(() => {
    const fetchSimData = async () => {
      try {
        const sims = await getSimData();
        setSimOptions(sims);
        const savedSim = await AsyncStorage.getItem("defaultSim");
        if (savedSim) {
          setSelectedSim(savedSim);
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Failed to load SIM data.");
      }
    };
    fetchSimData();
  }, []);

  const handleSimChange = (sim) => {
    setSelectedSim(sim);
    AsyncStorage.setItem("defaultSim", sim);
    Alert.alert("Success", `Default SIM set to ${sim}`);
  };

  return (
    <View>
      <Text style={styles.label}>Select Default SIM</Text>
      {simOptions.length > 1 ? (
        <Picker
          selectedValue={selectedSim}
          onValueChange={handleSimChange}
          style={styles.picker}
        >
          {simOptions.map((sim, index) => (
            <Picker.Item key={index} label={sim.carrierName} value={sim.slotIndex} />
          ))}
        </Picker>
      ) : (
        <Text style={styles.noSimText}>No dual-SIM detected</Text>
      )}
    </View>
  );
};

export default SmsSimPicker;
