// models/MenuItem.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuItemSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String }, // Assuming image path or URL
    quantity: { type: Number, default: 0, required: true },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
