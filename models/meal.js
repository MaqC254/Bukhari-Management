const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the meal schema
const mealSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

// Create the meal model
const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
