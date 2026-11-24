const express = require('express');
const router = express.Router();

const pemesananController = require('../controllers/pemesananController');
const { authenticate } = require('../middlewares/auth');

// Membuat pemesanan
router.post('/', authenticate, pemesananController.create);

// Melihat riwayat pemesanan pengguna
router.get('/', authenticate, pemesananController.getMyOrders);

// Melihat detail pemesanan
router.get('/:id', authenticate, pemesananController.getOrderById);

// Membatalkan pemesanan
router.put('/:id/batal', authenticate, pemesananController.cancelOrder);

module.exports = router;