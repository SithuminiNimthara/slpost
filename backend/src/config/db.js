const mysql = require("mysql");

// Create MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "rlprint",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the app on DB connection failure
  }
  console.log("✅ Connected to MySQL database");
});

module.exports = db;
