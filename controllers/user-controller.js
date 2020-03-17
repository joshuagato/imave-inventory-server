/* jshint esversion: 8 */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const config = require('../utilities/database-configuration');
const Product = require('../models/product-model');
const saltRounds = 12;

// Controller for User Registration
exports.userRegisration = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    const error = new Error('User email already taken!');
    error.statusCode = 401;

    return next(error);
  }

  try {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    // const profilePicture = req.file.path;
    const isAdmin = false;
    const hashedPw = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = await new User({
      firstname: firstname, lastname: lastname, email: email,
      isAdmin: isAdmin, password: hashedPw,
    });

    await newUser.save();

    res.json({ success: true, message: 'User Registration Successful!' });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};

// Controller for Admin Registration
exports.adminRegistration = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    const error = new Error('Admin email already taken!');
    error.statusCode = 401;

    return next(error);
  }

  try {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    // const profilePicture = req.file.path;
    const isAdmin = true;
    const hashedPw = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = await new User({
      firstname: firstname, lastname: lastname, email: email,
      isAdmin: isAdmin, password: hashedPw,
    });

    await newUser.save();

    res.json({ success: true, message: 'Admin Registration Successful!' });

  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;

    next(error);
  }
};

// Controller for loging users in
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      const error = new Error('Please check your Username or Passsword.');
      error.statusCode = 401;
      next(error);

    } else {
      const isEqual = await bcrypt.compare(req.body.password, user.password);

      if (!isEqual) {
        const error = new Error('Please check your Username or Password.');
        error.statusCode = 401;
        return next(error);

      } else {
        req.userLoggedIn = true;
        req.userId = user._id;

        const token = jwt.sign({ user: user }, config.secret, { expiresIn: '1d' });
        res.json({ success: true, message: 'Successful.', user: user, token: token });
      }
    }

  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};
