const mongoose = require("mongoose");

const cardSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    default: "",
  },
  labels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "label",
    },
  ],
  members: [
    {
      _id: false,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      name: {
        type: String,
      },
      surname: {
        type: String,
      },
      email: {
        type: String,
      },
      color: {
        type: String,
      },
    },
  ],
  watchers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      name: {
        type: String,
      },
    },
  ],
  date: {
    _id: false,
    startDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    dueTime: {
      type: String,
    },
    reminder: {
      type: Boolean,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  attachments: [
    {
      link: {
        type: String,
      },
      name: {
        type: String,
        default: null,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  activities: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },

      action: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      edited: {
        type: Boolean,
        default: false,
      },
      cardTitle: {
        type: String,
        default: "",
      },
      actionType: {
        type: String,
        default: "action",
      },
      isComment: {
        type: Boolean,
        default: false,
      },
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "list",
  },
  cover: {
    color: {
      type: String,
      default: null,
    },
    isSizeOne: {
      type: Boolean,
      default: null,
    },
  },
  checklists: [
    {
      title: {
        type: String,
      },
      items: [
        {
          text: {
            type: String,
          },
          completed: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  _destroy: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("card", cardSchema);
