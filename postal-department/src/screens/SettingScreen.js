import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Picker } from "react-native";
import { getSimData } from "react-native-sim-data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/settingsStyles";

const Settings = () => {
  const [simOptions, setSimOptions] = useState([]);
  const [selectedSim, setSelectedSim] = useState(null);

  useEffect(() => {
    const fetchSimData = async () => {
      try {
        const sims = await getSimData();
        setSimOptions(sims);
        // Load saved SIM setting
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
    <View style={styles.container}>
      <Text style={styles.title}>SMS Settings</Text>

      {simOptions.length > 1 ? (
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Default SIM</Text>
          <Picker
            selectedValue={selectedSim}
            onValueChange={handleSimChange}
            style={styles.picker}
          >
            {simOptions.map((sim, index) => (
              <Picker.Item key={index} label={sim.carrierName} value={sim.slotIndex} />
            ))}
          </Picker>
        </View>
      ) : (
        <Text style={styles.noSimText}>No dual-SIM detected</Text>
      )}
    </View>
  );
};

export default Settings;
