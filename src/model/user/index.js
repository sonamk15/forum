const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userName: {type: String, unique: true, required: true},
        name: {type: String,  required: true},
        phone: {type: Number },
        email: {type: String, unique: true, required: true},
        password: {type: String,  required: true},
        techStack: {type: Array }
    },
    { timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'} }
);

const User = mongoose.model("users", userSchema)

module.exports = {
    User
} 