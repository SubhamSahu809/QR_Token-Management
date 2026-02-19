const express = require("express");
const {
  generateToken,
  scanToken,
  getQrByMobileNumber,
} = require("../controllers/tokenController");

const router = express.Router();

router.post("/generate", generateToken);
router.post("/scan/:tokenId", scanToken);
router.get("/viewQr", getQrByMobileNumber);

module.exports = router;

