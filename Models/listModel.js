const mongoose = require("mongoose");

const listSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "card",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "board",
  },
  _destroy: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("list", listSchema);
