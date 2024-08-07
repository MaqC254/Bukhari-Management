const mongoose = require('mongoose');

// Define Schema
const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    quantity: Number,
    price: Number,
    state: { type: String, default: 'online' }, 
    customerPhone: String,
    month: Number,
    tableNumber : { type: Number, default: 0} ,
    createdAt: { type: Date, default: Date.now },
    month: Number,
    paid: { type: Boolean, default: false }
});

// Middleware to set the month before saving
itemSchema.pre('save', function(next) {
    const now = new Date();
    this.month = now.getMonth() + 1; // getMonth() returns 0-indexed month
    next();
});

// Create Model
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
