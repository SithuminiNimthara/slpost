export const calculatePostage = (weight, companyType) => {
  // Ensure weight is a valid number
  if (typeof weight !== "number" || isNaN(weight) || weight <= 0) return null;

  // Maximum weight check (40kg = 40000g)
  if (weight > 40000) return null;

  // Special Case: Government Department (Flat Rate for ≤30g)
  if (companyType === "Government Department" && weight <= 30) {
    return 150.0;
  }

  // Standard Postage Rates
  if (weight <= 250) return 200.0;
  if (weight <= 500) return 250.0;
  if (weight <= 1000) return 350.0;
  if (weight <= 2000) return 400.0;
  if (weight <= 3000) return 450.0;
  if (weight <= 4000) return 500.0;
  if (weight <= 5000) return 550.0;
  if (weight <= 6000) return 600.0;
  if (weight <= 7000) return 700.0;
  if (weight <= 8000) return 750.0;
  if (weight <= 9000) return 800.0;
  if (weight <= 10000) return 900.0;
  if (weight <= 15000) return 1000.0;
  if (weight <= 20000) return 1500.0;
  if (weight <= 25000) return 1800.0;
  if (weight <= 30000) return 2100.0;
  if (weight <= 35000) return 2600.0;
  if (weight <= 40000) return 3100.0;

  return null;
};
