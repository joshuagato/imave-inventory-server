/* jshint esversion: 8 */
const uuid4 = require('uuid/v4');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
