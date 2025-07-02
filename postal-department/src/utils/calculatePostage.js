export const calculatePostage = (weight, company_type) => {
  const w = parseFloat(weight);
  if (isNaN(w) || w <= 0) return null;
  if (w > 40000) return null;

  // Normalize company_type: replace underscores with spaces and lowercase trim
  const type = (company_type || "").toString().trim().toLowerCase().replace(/_/g, " ");

  // Special Case: Government Department (flat rate for weight ≤ 30g)
  if (type === "government department" && w <= 30) {
    console.log("Special case matched: Govt Dept ≤ 30g → Rs. 150");
    return 150.0;
  }

  if (w <= 250) return 200.0;
  if (w <= 500) return 250.0;
  if (w <= 1000) return 350.0;
  if (w <= 2000) return 400.0;
  if (w <= 3000) return 450.0;
  if (w <= 4000) return 500.0;
  if (w <= 5000) return 550.0;
  if (w <= 6000) return 600.0;
  if (w <= 7000) return 700.0;
  if (w <= 8000) return 750.0;
  if (w <= 9000) return 800.0;
  if (w <= 10000) return 900.0;
  if (w <= 15000) return 1000.0;
  if (w <= 20000) return 1500.0;
  if (w <= 25000) return 1800.0;
  if (w <= 30000) return 2100.0;
  if (w <= 35000) return 2600.0;
  if (w <= 40000) return 3100.0;

  return null;
};
