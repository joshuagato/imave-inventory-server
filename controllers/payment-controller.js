/* jshint esversion: 8 */
const uuid4 = require('uuid/v4');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/product-model');

exports.makePayment = (req, res, next) => {
  const { product, token } = req.body;
  console.log('Token', token);
  console.log('Product', product);

  const uuid = uuid4();
  const idempotencyKey = uuid;

  return stripe.customers.create({
    email: token.email,
    source: token.id,
  })
  .then(customer => stripe.charges.create(
    {
      amount: product.price * 100,
      currency: 'usd',
      customer: customer.id,
      receipt_email: token.email,
      description: `purchase of ${product.name}`,
      shipping: {
        name: token.card.name,
        address: {
          city: token.card.address_city,
          // state: token.card.address_state,
          line1: token.card.address_line1,
          // line2: token.card.address_line2,
          // address_zip: token.card.address_zip,
          country: token.card.address_country,
        },
      },
    },
    { idempotencyKey }
  ))
  .then(result => res.status(200).json(result))
  .catch(error => console.log(error));
};

exports.makePaymentFromStraightPurchase = async (req, res, next) => {
  try {
    const { product, token } = req.body;
    const idempotencyKey = uuid4();

    const serverProduct = await Product.findById(product._id);

    if (!serverProduct) {
      const error = new Error('Product not found!');
      error.statusCode = 401;
      return next(error);
    }

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: serverProduct.price * 100,
        currency: 'usd',
        // customer: token.card.id,
        receipt_email: token.email,
        description: `purchase of ${serverProduct.title}`,
        shipping: {
          carrier: '',
          name: token.card.name,
          phone: '233244306303',
          tracking_number: '23232313',
          address: {
            city: token.card.address_city,
            line1: token.card.address_line1,
            line2: 'Bungalow 12',
            postal_code: 'Box AF 289',
            state: 'Greater Accra',
            country: token.card.address_country,
          },
        },
        metadata: { integration_check: 'accept_a_payment' },
      },
      { idempotencyKey }
    );

    res.status(200).json({ success: true, paymentIntent: paymentIntent });

  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    next(error);
  }
};

exports.makePaymentFromNonUserCart = async (req, res, next) => {};

exports.makePaymentFromLoggedInUserCart = async (req, res, next) => {};
