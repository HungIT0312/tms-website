const mongoose = require("mongoose");

const labelSchema = mongoose.Schema({
  text: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "board",
  },
});

module.exports = mongoose.model("label", labelSchema);
