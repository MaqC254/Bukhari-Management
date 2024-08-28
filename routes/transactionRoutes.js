const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

// Route to render transactions page
router.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('employeeId', 'name phone workID role');
        res.render('transactions', { transactions });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
});

module.exports = router;
