const mongoose = require("mongoose");

const missingPersonSchema = new mongoose.Schema({
  //createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  name: { type: String, default: "Unknown" },
  age: Number,
  gender: { type: String, enum: ["male", "female", "unknown"], default: "unknown" },

  lastSeenLocation: String,
  lastSeenDate: Date,

  description: String,
  photoUrl: String,

  status: { type: String, enum: ["missing", "found"], default: "missing" }
}, { timestamps: true });

module.exports = mongoose.model("MissingPerson", missingPersonSchema);
