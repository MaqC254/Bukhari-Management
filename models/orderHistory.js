// models/orderHistory.js

const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
    confirmedAt: {
        type: Date,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    foodOrdered: {
        type: [String], // Assuming mealDetails is an array; adjust as needed
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    }
});

const OrderHistory = mongoose.model('OrderHistory', orderHistorySchema);

module.exports = OrderHistory;
