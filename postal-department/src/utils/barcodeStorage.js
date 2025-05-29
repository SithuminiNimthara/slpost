import AsyncStorage from "@react-native-async-storage/async-storage";

const DELIVERY_KEY = "delivery_barcodes";
const UNDELIVERY_KEY = "undelivered_barcodes";

export const loadBarcodes = async () => {
  const data = await AsyncStorage.getItem(DELIVERY_KEY);
  return data ? JSON.parse(data) : [];
};

export const storeBarcodes = async (barcodes) => {
  await AsyncStorage.setItem(DELIVERY_KEY, JSON.stringify(barcodes));
};

export const loadUndeliveryBarcodes = async () => {
  const data = await AsyncStorage.getItem(UNDELIVERY_KEY);
  return data ? JSON.parse(data) : [];
};

export const storeUndeliveryBarcodes = async (barcodes) => {
  await AsyncStorage.setItem(UNDELIVERY_KEY, JSON.stringify(barcodes));
};

export const clearUndeliveryBarcodes = async () => {
  await AsyncStorage.removeItem(UNDELIVERY_KEY);
};
