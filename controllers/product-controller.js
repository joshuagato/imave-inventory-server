/* jshint esversion: 8 */
const Product = require('../models/product-model');

exports.createProduct = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const productPicture = req.file.path;

  try {
    const newProduct = new Product({
      title: title, price: price,
      description: description, productPicture: productPicture,
    });

    await newProduct.save();

    res.json({ success: true, message: 'Product Creation Successful!' });

  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

exports.fetchAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.json({ success: true, products: products });

  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
};
