// models/server_items.js

const mongoose = require('mongoose');

// Define Schema
const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    quantity: Number,
    price: Number,
    state: { type: String, default: 'online' }, // Adding the 'state' field with default value 'online'
    customerPhone: String,
});

// Create Model
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
