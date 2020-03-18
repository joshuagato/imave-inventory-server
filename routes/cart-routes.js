/* jshint esversion: 8 */
const router = require('express').Router();
const cartController = require('../controllers/cart-controller');
const checkJWT = require('../middlewares/check-jwt');

// AddToCart route
router.post('/cart/add-item', checkJWT, cartController.addToCart);

// RemoveFromCart route
router.post('/cart/remove-item', checkJWT, cartController.removeFromCart);

// Increase item-quantity route
router.post('/cart/increase-quantity', checkJWT, cartController.increaseItemQuantity);

// Decrease item-quantity route
router.post('/cart/decrease-quantity', checkJWT, cartController.decreaseItemQuantity);

// ClearCart route
router.post('/cart/clear-cart', checkJWT, cartController.clearCart);

// FetchCart route
router.get('/cart/fetch-cart', checkJWT, cartController.fetchCart);

module.exports = router;
