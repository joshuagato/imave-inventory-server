/* jshint esversion: 8 */
const Product = require('../models/product-model');
const NonUserCart = require('../models/nonusecart-model');

// Controller for creating nonuser'shopping cart
exports.createCart = async (req, res, next) => {
  try {
    const nonuserCart = await NonUserCart.findOne({ nonLoggedInUserId: req.body.nonLoggedInUserId });

    if (nonuserCart) {
      const error = new Error('Cart already exists for this user!');
      error.statusCode = 401;

      return next(error);
    }

    const newNonUserCart = await new NonUserCart({ nonLoggedInUserId: req.body.nonLoggedInUserId });
    await newNonUserCart.save();

    res.json({ success: true, message: 'Cart created Successfully.' });

  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

// Controller for adding items to the nonuser's shopping cart
exports.addToCart = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);

    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 401;
      return next(error);
    }

    const nonuserCart = await NonUserCart.findOne({ nonLoggedInUserId: req.body.nonLoggedInUserId });

    if (!nonuserCart) {
      const error = new Error('An error occured. Please try again.');
      error.statusCode = 401;
      return next(error);
    }

    const result = await nonuserCart.addToCart(product);
    if (!result) {
      const error = new Error('An error occured. Please try again');
      error.statusCode = 401;
      return next(error);
    }

    res.json({ success: true, message: 'Successfully added product to cart.' });

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

    const nonuserCart = await NonUserCart.findOne({ nonLoggedInUserId: req.body.nonLoggedInUserId });

    if (!nonuserCart) {
      const error = new Error('An error occured. Please try again.');
      error.statusCode = 401;
      return next(error);
    }

    const result = await nonuserCart.increaseItemQuantity(product);
    if (!result) {
      const error = new Error('An error occured. Please try again');
      error.statusCode = 401;
      return next(error);
    }

    res.json({ success: true, message: 'Successfully increased item quantity.' });

  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

// Controller for decreasing a shopping cart item's quantity
exports.decreaseItemQuantity = async (req, res, next) => {
  try {
    const product = await Product.findById(req.body.productId);

    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = 401;
      return next(error);
    }

    const nonuserCart = await NonUserCart.findOne({ nonLoggedInUserId: req.body.nonLoggedInUserId });

    if (!nonuserCart) {
      const error = new Error('An error occured. Please try again.');
      error.statusCode = 401;
      return next(error);
    }

    const result = await nonuserCart.decreaseItemQuantity(product);
    if (!result) {
      const error = new Error('An error occured. Please try again');
      error.statusCode = 401;
      return next(error);
    }

    res.json({ success: true, message: 'Successfully decreased item quantity.' });

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

    const nonuserCart = await NonUserCart.findOne({ nonLoggedInUserId: req.body.nonLoggedInUserId });

    if (!nonuserCart) {
      const error = new Error('An error occured. Please try again.');
      error.statusCode = 401;
      return next(error);
    }

    const result = await nonuserCart.removeFromCart(product._id);

    if (!result) {
      const error = new Error('An error occured. Please try again');
      error.statusCode = 401;
      return next(error);
    }

    res.json({ success: true, message: 'Successfully removed product from cart.' });

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

  res.json({ success: true, message: 'Successfully cleared the shopping cart.' });
};

// Controller for fetching the shopping cart
exports.fetchCart = async (req, res, next) => {
  try {
    const nonuserCart = await NonUserCart.findOne({ nonLoggedInUserId: req.body.nonLoggedInUserId });

    if (!nonuserCart) {
      const error = new Error('An error occured. Please try again.');
      error.statusCode = 401;
      return next(error);
    }

    const result = await nonuserCart.fetchCart();

    res.json({ success: true, cart: result });

  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    return next(error);
  }
};
