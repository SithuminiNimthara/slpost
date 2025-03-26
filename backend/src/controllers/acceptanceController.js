const db = require("../config/db");

exports.storeAcceptance = async (req, res) => {
  try {
    const {
      barcodeNo,
      receiverName,
      address1,
      address2,
      city1,
      city2,
      weight,
      postage,
    } = req.body;

    // Set default values
    const doffice = 0;
    const RLid = 0;
    const status = 0;

    const query = `
      INSERT INTO article (regno, name, address1, address2, city1, city2, doffice, RLid, status, weight, netprice, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      barcodeNo,
      receiverName,
      address1,
      address2,
      city1,
      city2,
      doffice,
      RLid,
      status,
      weight,
      postage,
    ];

    // Execute Query with better error handling
    db.query(query, values, (error, result) => {
      if (error) {
        console.error(
          "Error storing acceptance details:",
          error.sqlMessage || error
        );
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: error.sqlMessage });
      }

      console.log("Inserted ID:", result.insertId);

      return res.status(201).json({
        message: "Acceptance details stored successfully!",
        id: result.insertId,
      });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};
