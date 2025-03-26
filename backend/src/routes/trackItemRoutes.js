const express = require("express");
const router = express.Router();
const trackItemController = require("../controllers/trackItemController");


router.get("/", trackItemController.getEventsByBarcode);

module.exports = router;
