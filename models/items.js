const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    image: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    category: String,
    state: { type: String, default: 'online' },
    customerPhone: String,
    orderId: String,
    location: String,
    tableNumber: String,
    serverId: {type: String, default: 'na'},
    paid: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
