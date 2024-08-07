const mongoose = require('mongoose');

const paymentRequestSchema = new mongoose.Schema({
    phoneNumber: String,
    mpesaCode: String,
    amount: Number,
    location: String,
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PaymentRequest', paymentRequestSchema);
