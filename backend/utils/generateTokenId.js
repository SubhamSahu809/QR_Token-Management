const crypto = require("crypto");

function generateTokenId() {
  return crypto.randomBytes(8).toString("hex");
}

module.exports = generateTokenId;

