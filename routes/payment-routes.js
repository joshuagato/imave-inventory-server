/* jshint esversion: 8 */
const router = require('express').Router();
const paymentController = require('../controllers/payment-controller');

// Payment route
// router.post('/make-payment', paymentController.makePayment);

router.post('/make-payment-from-straight-purchase', paymentController.makePaymentFromStraightPurchase);

router.post('/make-payment-from-nonLoggedIn-cart', paymentController.makePaymentFromNonUserCart);

router.post('/make-payment-from-loggedInUser-cart', paymentController.makePaymentFromLoggedInUserCart);

module.exports = router;
