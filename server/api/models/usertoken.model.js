const mongoose = require("mongoose");

const UserTokenSchema = new mongoose.Schema({
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   required: true,
  //   ref: "User",
  // },
  email: { type: String, required: true, unique: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, default: false },
  expiryDate: { type: Date, required: true },
});

const UserToken = mongoose.model("UserToken", UserTokenSchema);

module.exports = UserToken;
