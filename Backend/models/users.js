const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true 
    },
    password: String,
    googleId: String,
    profileImage: String,
    age: Number,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isFrozen: { type: Boolean, default: false },
    frozenAt: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true });

// Ensure email is indexed for faster queries
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
