export const calculatePostage = (weight, companyType) => {
  // Special Case: Government Department (Flat Rate for ≤30g)
  if (companyType === "Government Department" && weight <= 30) {
    return 150.0;
  }

  // Standard Postage Rates
  if (weight > 0 && weight <= 250) return 200.0;
  if (weight > 250 && weight <= 500) return 250.0;
  if (weight > 500 && weight <= 1000) return 350.0;
  if (weight > 1000 && weight <= 2000) return 400.0;
  if (weight > 2000 && weight <= 3000) return 450.0;
  if (weight > 3000 && weight <= 4000) return 500.0;
  if (weight > 4000 && weight <= 5000) return 550.0;
  if (weight > 5000 && weight <= 6000) return 600.0;
  if (weight > 6000 && weight <= 7000) return 700.0;
  if (weight > 7000 && weight <= 8000) return 750.0;
  if (weight > 8000 && weight <= 9000) return 800.0;
  if (weight > 9000 && weight <= 10000) return 900.0;
  if (weight > 10000 && weight <= 15000) return 1000.0;
  if (weight > 15000 && weight <= 20000) return 1500.0;
  if (weight > 20000 && weight <= 25000) return 1800.0;
  if (weight > 25000 && weight <= 30000) return 2100.0;
  if (weight > 30000 && weight <= 35000) return 2600.0;
  if (weight > 35000 && weight <= 40000) return 3100.0;

  return "Invalid weight"; // Handle cases where weight is out of range
};
