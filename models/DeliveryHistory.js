const mongoose = require('mongoose');

const DeliveryHistorySchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    confirmationCode: { type: String, required: true },
    driver: { type: String, required: true }
});

module.exports = mongoose.model('DeliveryHistory', DeliveryHistorySchema);