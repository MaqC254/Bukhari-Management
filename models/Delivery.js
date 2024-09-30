// models/Delivery.js
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    confirmationCode: { type: String, required: true },
    driver: { type: String, required: true },
});

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
