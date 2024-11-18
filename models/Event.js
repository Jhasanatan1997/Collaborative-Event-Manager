const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tasks: [
        {
            title: { type: String, required: true },
            description: { type: String },
            assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            dueDate: { type: Date },
            status: { type: String, enum: ["pending", "completed"], default: "pending" }
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);