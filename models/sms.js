const mongoose = require('mongoose');

// Define a schema for the SMS data
const smsSchema = new mongoose.Schema({
    transactionCode: String,
    amount: Number,
    phoneNumber: String,
    userName: String,
    date: Date
});

// Create a model based on the schema
const SMS = mongoose.model('SMS', smsSchema);

module.exports = SMS;