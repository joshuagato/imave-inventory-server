/* jshint esversion: 6 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  profilePicture: String,
  isAdmin: Boolean,
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [{
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      unitPrice: { type: Number, required: true },
      subTotalPrice: { type: Number },
      grandTotalPrice: { type: Number }
    }]
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
  let newQuantity = 1;
  let newPrice = product.price;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    newPrice = this.cart.items[cartProductIndex].price + product.price;

    updatedCartItems[cartProductIndex].quantity = newQuantity;
    updatedCartItems[cartProductIndex].price = newPrice;

  } else {
    updatedCartItems.push({ productId: product._id, quantity: newQuantity, price: newPrice });
  }

  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.increaseItemQuantity = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
  const updatedCartItems = [...this.cart.items];
  let newQuantity;
  let newPrice;

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    newPrice = this.cart.items[cartProductIndex].price + product.price;

    updatedCartItems[cartProductIndex].quantity = newQuantity;
    updatedCartItems[cartProductIndex].price = newPrice;
  }

  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save();
}

userSchema.methods.decreaseItemQuantity = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
  const updatedCartItems = [...this.cart.items];
  let newQuantity;
  let newPrice;

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity - 1;
    newPrice = this.cart.items[cartProductIndex].price - product.price;

    updatedCartItems[cartProductIndex].quantity = newQuantity;
    updatedCartItems[cartProductIndex].price = newPrice;
  }

  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;
  return this.save();
}

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());

  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
