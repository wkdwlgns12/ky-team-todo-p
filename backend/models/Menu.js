const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, unique: true },
        votes: { type: Number, default: 0 }
    },
    { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);