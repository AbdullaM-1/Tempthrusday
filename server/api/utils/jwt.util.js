const JWT = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Generates a JWT token based on the provided user ID.
 * @param {string} _id - The ID of the user (Admin, Patient, Doctor).
 * @param {string} role - The role of the user (Admin, Patient, Doctor).
 * @returns {Promise<string>} The generated JWT token.
 */
const generateToken = (_id, role) => {
  const payload = { _id, role };

  const signedToken = JWT.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
  return signedToken;
};

module.exports = {
  generateToken,
};
