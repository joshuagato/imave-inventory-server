/* jshint esversion: 8 */
const Product = require('../models/product-model');

// Controller for adding items to the user's shopping cart
exports.addToCart = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);

    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 401;
      return next(error);
    }

    if (!req.user) {
      const error = new Error('Please login to continue');
      error.statusCode = 401;
      return next(error);
    }

    const result = await req.user.addToCart(product);
    if (!result) {
      const error = new Error('An error occured. Please try again');
      error.statusCode = 401;
      return next(error);
    }

    res.json({ message: 'Successfully added product to cart.' });

  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

// Controller for increasing a shopping cart item's quantity
exports.increaseItemQuantity = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);

    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 401;
      return next(error);
    }

    if (!req.user) {
      const error = new Error('Please login to continue');
      error.statusCode = 401;
      return next(error);
    }

    const result = await req.user.increaseItemQuantity(product);
    if (!result) {
      const error = new Error('An error occured. Please try again');
      error.statusCode = 401;
      return next(error);
    }

    res.json({ message: 'Successfully increased item quantity.' });

  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

// Controller for decreasing a shopping cart item's quantity
exports.increaseItemQuantity = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);

    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 401;
      return next(error);
    }

    if (!req.user) {
      const error = new Error('Please login to continue');
      error.statusCode = 401;
      return next(error);
    }

    const result = await req.user.decreaseItemQuantity(product);
    if (!result) {
      const error = new Error('An error occured. Please try again');
      error.statusCode = 401;
      return next(error);
    }

    res.json({ message: 'Successfully decreased item quantity.' });

  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

// Controller for removing items from the user's shopping cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);

    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 401;
      return next(error);
    }

    if (!req.user) {
      const error = new Error('Please login to continue');
      error.statusCode = 401;
      return next(error);
    }

    const result = await req.user.removeFromCart(product._id);
    if (!result) {
      const error = new Error('An error occured. Please try again');
      error.statusCode = 401;
      return next(error);
    }

    res.json({ message: 'Successfully removed product from cart.' });

  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

// Controller for clearing the shopping cart
exports.clearCart = async (req, res, next) => {
  try {
    if (!req.user) {
      const error = new Error('Please login to continue');
      error.statusCode = 401;
      return next(error);
    }

    const result = await req.user.clearCart();

  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    return next(error);
  }

  res.json({ message: 'Successfully cleared the shopping cart.' });
};
