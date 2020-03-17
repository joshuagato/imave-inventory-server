/* jshint esversion: 8 */
const router = require('express').Router();
const cartController = require('../controllers/cart-controller');
const checkJWT = require('../middlewares/check-jwt');

// AddToCart route
router.post('/cart/add-item', checkJWT, cartController.addToCart);

// Increment item quantity
router.post('/cart/increase-quantity', cartController.increaseItemQuantity);

// RemoveFromCart routes
router.post('/cart/remove-item', checkJWT, cartController.removeFromCart);

// ClearCart routes
router.post('/cart/clear-cart', checkJWT, cartController.clearCart);

module.exports = router;
