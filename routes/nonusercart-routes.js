/* jshint esversion: 8 */
const router = require('express').Router();
const nonUserCartController = require('../controllers/nonusercart-controller');

// CreateCart route
router.post('/nonusercart/create-cart', nonUserCartController.createCart);

// AddToCart route
router.post('/nonusercart/add-item', nonUserCartController.addToCart);

// RemoveFromCart route
router.post('/nonusercart/remove-item', nonUserCartController.removeFromCart);

// Increase item-quantity route
router.post('/nonusercart/increase-quantity', nonUserCartController.increaseItemQuantity);

// Decrease item-quantity route
router.post('/nonusercart/decrease-quantity', nonUserCartController.decreaseItemQuantity);

// ClearCart route
router.post('/nonusercart/clear-cart', nonUserCartController.clearCart);

// FetchCart route
router.post('/nonusercart/fetch-cart', nonUserCartController.fetchCart);

module.exports = router;
