/* jshint esversion: 8 */
const router = require('express').Router();
const productController = require('../controllers/product-controller');
const checkJWT = require('../middlewares/check-jwt');

// create new product route
router.post('/admin/product', productController.createProduct);

// Fetch all products route
router.get('/products', productController.fetchAllProducts);

module.exports = router;
