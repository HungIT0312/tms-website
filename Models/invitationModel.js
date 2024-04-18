const mongoose = require("mongoose");

const invitationSchema = mongoose.Schema({
  inviter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
//   invited: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "user",
//     required: true,
//   },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "board",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
  },
});

module.exports = mongoose.model("invitation", invitationSchema);
