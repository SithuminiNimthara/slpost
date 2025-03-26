require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./src/config/db"); // Import database connection
const trackItemRoutes = require("./src/routes/trackItemRoutes"); // Import routes
const acceptanceRoutes = require("./src/routes/acceptanceRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/track-item", trackItemRoutes);
app.use("/api/acceptance", acceptanceRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
