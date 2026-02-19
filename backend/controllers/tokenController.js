const QRCode = require("qrcode");
const Token = require("../models/Token");
const generateTokenId = require("../utils/generateTokenId");

// POST /tokens/generate
async function generateToken(req, res) {
  try {
    const { name, mobileNumber, maxCount } = req.body;

    if (!name || !mobileNumber || !maxCount) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const max = Number(maxCount);
    if (Number.isNaN(max) || max <= 0) {
      return res
        .status(400)
        .json({ message: "Token count must be a positive number." });
    }

    const tokenId = generateTokenId();

    const newToken = new Token({
      name,
      mobileNumber,
      tokenId,
      maxCount: max,
      remainingCount: max,
      status: "active",
    });

    await newToken.save();

    const baseUrl = process.env.FRONTEND_BASE_URL;
    const scanUrl = `${baseUrl}/scan/${tokenId}`;

    const qrCodeDataUrl = await QRCode.toDataURL(scanUrl);

    return res.status(201).json({
      message: "Token generated successfully.",
      token: newToken,
      qrCodeDataUrl,
      scanUrl,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return res.status(500).json({ message: "Server error while creating token. Error: " + error.message });
  }
}

// POST /tokens/scan/:tokenId
async function scanToken(req, res) {
  try {
    const { tokenId } = req.params;
    let { scanCount } = req.body;

    if (!scanCount) {
      scanCount = 1;
    }

    const count = Number(scanCount);
    if (Number.isNaN(count) || count <= 0) {
      return res
        .status(400)
        .json({ message: "Scan count must be a positive number." });
    }

    const updatedToken = await Token.findOneAndUpdate(
      {
        tokenId,
        status: "active",
        remainingCount: { $gte: count },
      },
      {
        $inc: { remainingCount: -count },
      },
      { new: true }
    );

    if (!updatedToken) {
      const existing = await Token.findOne({ tokenId });
      if (!existing) {
        return res.status(404).json({ message: "Token not found." });
      }
      if (existing.status === "expired" || existing.remainingCount === 0) {
        return res.status(400).json({ message: "Token has expired." });
      }
      return res
        .status(400)
        .json({ message: "Not enough remaining scans for this token." });
    }

    if (updatedToken.remainingCount === 0 && updatedToken.status !== "expired") {
      updatedToken.status = "expired";
      await updatedToken.save();
    }

    return res.status(200).json({
      message: "Token scanned successfully.",
      token: updatedToken,
    });
  } catch (error) {
    console.error("Error scanning token:", error);
    return res.status(500).json({ message: "Server error while scanning token." });
  }
}

// GET /tokens/qr-by-mobile?mobileNumber=...
async function getQrByMobileNumber(req, res) {
  try {
    const { mobileNumber } = req.query;

    if (!mobileNumber) {
      return res
        .status(400)
        .json({ message: "Mobile number is required." });
    }

    const token = await Token.findOne({ mobileNumber }).sort({
      createdAt: -1,
    });

    if (!token) {
      return res
        .status(404)
        .json({ message: "No token found for this mobile number." });
    }

    const baseUrl = process.env.FRONTEND_BASE_URL;
    const scanUrl = `${baseUrl}/scan/${token.tokenId}`;

    const qrCodeDataUrl = await QRCode.toDataURL(scanUrl);

    return res.status(200).json({
      message: "QR code fetched successfully.",
      token,
      qrCodeDataUrl,
      scanUrl,
    });
  } catch (error) {
    console.error("Error getting QR by mobile number:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching QR for mobile number." });
  }
}

module.exports = {
  generateToken,
  scanToken,
  getQrByMobileNumber,
};

