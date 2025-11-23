const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        U_name: { type: String, required: true },
        U_email: { type: String, required: true, unique: true },
        U_dob: { type: Date, required: true },
        password: { type: String, required: true },
        Status: { type: String, default: 'active' },
        softDelete: { type: String, default: 'no' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
