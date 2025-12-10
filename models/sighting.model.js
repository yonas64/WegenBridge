const mongoose = require("mongoose");

const sightingSchema = new mongoose.Schema({
  missingPerson: { type: mongoose.Schema.Types.ObjectId, ref: "MissingPerson", required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  location: String,
  sightingDate: Date,

  description: String,
  photoUrl: String
}, { timestamps: true });

module.exports = mongoose.model("Sighting", sightingSchema);
