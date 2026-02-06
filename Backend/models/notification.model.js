const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipientPhone: String,
    recipientEmail: String,
    title: String,
    message: { type: String, required: true },
    type: { type: String, default: "sighting" },
    relatedMissingPerson: { type: mongoose.Schema.Types.ObjectId, ref: "MissingPerson" },
    relatedSighting: { type: mongoose.Schema.Types.ObjectId, ref: "Sighting" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
