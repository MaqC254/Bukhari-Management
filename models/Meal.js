const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true } 
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;
