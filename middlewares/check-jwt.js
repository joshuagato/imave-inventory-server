/* jshint esversion: 8 */
const jwt = require('jsonwebtoken');
const config = require('../utilities/database-configuration');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    req.userLoggedIn = false;
    req.userId = null;

    const error = new Error('No token provided.');
    error.statusCode = 401;
    return next(error);
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.secret);

  } catch (error) {
    req.userLoggedIn = false;
    req.userId = null;

    if (!error.statusCode) error.statusCode = 500;
    return next(error);
  }

  if (!decodedToken) {
    req.userLoggedIn = false;
    req.userId = null;

    const error = new Error('Failed to authenticate token.');
    error.statusCode = 401;
    return next(error);
  }

  // Here, the user attribute of the decodedToken object is being picked from the
  // user attribute of the jwt sign object which is created when a user signs in

  req.userLoggedIn = true;
  req.userId = decodedToken.user._id;
  next();

};
