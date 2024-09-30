const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery'); // Ensure this path is correct

// Route to fetch delivery history
router.get('/get-delivery-history/:driverId', async (req, res) => {
    const { driverId } = req.params;

    try {
        // Fetch delivery records from the deliveries collection
        const history = await Delivery.find({ driver: driverId }).sort({ timestamp: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching delivery history:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch delivery history.' });
    }
});

module.exports = router;
