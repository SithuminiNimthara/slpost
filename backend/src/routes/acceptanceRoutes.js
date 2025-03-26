const express = require("express");
const router = express.Router();
const acceptanceController = require("../controllers/acceptanceController");

router.post("/store", acceptanceController.storeAcceptance);

module.exports = router;
