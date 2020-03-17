/* jshint esversion: 8 */
const router = require('express').Router();
const userController = require('../controllers/user-controller');
const checkJWT = require('../middlewares/check-jwt');

// TODO: add the validation middleware
router.post('/register', userController.userRegisration);

// TODO: add the validation middleware
router.post('/admin/register', userController.adminRegistration);

// login route
router.post('/login', userController.login);

module.exports = router;
