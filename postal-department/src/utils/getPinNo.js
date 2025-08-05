import AsyncStorage from "@react-native-async-storage/async-storage";

export const getPinNo = async () => {
  const pin = await AsyncStorage.getItem("pinNo");
  if (!pin) {
    throw new Error("PIN No not found. Please set it first.");
  }
  return pin;
};

 
