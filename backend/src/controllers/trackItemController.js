const db = require("../config/db");

exports.getEventsByBarcode = (req, res) => {
  const { barcode } = req.query;

  if (!barcode) {
    return res.status(400).json({ error: "Barcode is required" });
  }

  // Updated SQL query based on your given tables
  const query = `
    SELECT et.id, et.itemidentifier, et.Eventid, et.Tdatetime, et.statusid, et.locationid, et.officer, 
           p.poname AS location_name 
    FROM eventtrack et
    LEFT JOIN postoffice p ON et.locationid = p.id
    WHERE et.itemidentifier = ?
  `;

  // Execute the query with the barcode
  db.query(query, [barcode], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database query error", details: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(results); // Return the query results
  });
};
