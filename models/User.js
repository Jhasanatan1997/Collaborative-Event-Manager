// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    googleCalendarToken: {type: String},
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
