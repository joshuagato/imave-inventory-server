/* jshint esversion: 8 */
const router = require('express').Router();
const paymentController = require('../controllers/payment-controller');

// Payment route
router.post('/make-payment', paymentController.makePayment);

module.exports = router;
