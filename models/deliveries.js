const mongoose = require("mongoose");

const Delivery = mongoose.model("Delivery", new mongoose.Schema({
    code: {
        type: Number,
        default: () => Math.floor(1000 + Math.random() * 9000) 
    },
    orderId: String,
    driver: String,
    status: {
        type: Boolean,
        default: false
    },
    ETA: {
        type: Number,
        default: () => Math.floor(5 + Math.random() * 56)
    }
}));

module.exports = Delivery;
