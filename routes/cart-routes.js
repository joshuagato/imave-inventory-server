/* jshint esversion: 8 */
const router = require('express').Router();
const cartController = require('../controllers/cart-controller');
const checkJWT = require('../middlewares/check-jwt');

// AddToCart route
router.post('/cart/add-item', checkJWT, cartController.addToCart);

// Increase item quantity
router.post('/cart/increase-quantity', checkJWT, cartController.increaseItemQuantity);

// Decrease item quantity
router.post('/cart/decrease-quantity', checkJWT, cartController.decreaseItemQuantity);

// RemoveFromCart routes
router.post('/cart/remove-item', checkJWT, cartController.removeFromCart);

// ClearCart routes
router.post('/cart/clear-cart', checkJWT, cartController.clearCart);

module.exports = router;
