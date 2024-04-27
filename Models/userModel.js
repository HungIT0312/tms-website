const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,

  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  color: {
    type: String,
  },
  boards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "board",
    },
  ],
  invitations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invitation",
    },
  ],
  _destroy: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
});

module.exports = mongoose.model("user", userSchema);
