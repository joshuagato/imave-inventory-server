/* jshint esversion: 6 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  imageUrl: String,
  isAdmin: Boolean,
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        subTotalPrice: { type: Number, required: true },
      },
    ],
    grandTotalPrice: { type: Number, required: true },
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
  let newQuantity = 1;
  let newPrice = product.price;
  const updatedCartItems = [...this.cart.items];
  let grandTotal = 0;
  let grandTotalPriceVar = 0;

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    newPrice = this.cart.items[cartProductIndex].subTotalPrice + product.price;

    updatedCartItems[cartProductIndex].quantity = newQuantity;
    updatedCartItems[cartProductIndex].subTotalPrice = newPrice;

  } else {
    updatedCartItems.push({ productId: product._id, quantity: newQuantity, unitPrice: newPrice, subTotalPrice: newPrice });
  }

  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;

  grandTotal = this.cart.items.map(cp => cp.subTotalPrice);  // []
  grandTotal.forEach(sub => grandTotalPriceVar += sub); // int
  this.cart.grandTotalPrice = grandTotalPriceVar;

  return this.save();
};

userSchema.methods.increaseItemQuantity = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
  const updatedCartItems = [...this.cart.items];
  let grandTotal = 0;
  let grandTotalPriceVar = 0;

  if (cartProductIndex >= 0) {
    updatedCartItems[cartProductIndex].quantity += 1;
    updatedCartItems[cartProductIndex].subTotalPrice += product.price;
  }

  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;

  grandTotal = this.cart.items.map(cp => cp.subTotalPrice);  // []
  grandTotal.forEach(sub => grandTotalPriceVar += sub); // int
  this.cart.grandTotalPrice = grandTotalPriceVar;

  return this.save();
}

userSchema.methods.decreaseItemQuantity = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString());
  const updatedCartItems = [...this.cart.items];
  let grandTotal = 0;
  let grandTotalPriceVar = 0;

  if (cartProductIndex >= 0) {
    updatedCartItems[cartProductIndex].quantity -= 1;
    updatedCartItems[cartProductIndex].subTotalPrice -= product.price;
  }

  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;

  grandTotal = this.cart.items.map(cp => cp.subTotalPrice);  // []
  grandTotal.forEach(sub => grandTotalPriceVar += sub); // int
  this.cart.grandTotalPrice = grandTotalPriceVar;

  if (updatedCartItems[cartProductIndex].quantity === 0) {
    return this.removeFromCart(product._id);
  }

  return this.save();
}

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
  let grandTotal = 0;
  let grandTotalPriceVar = 0;

  this.cart.items = updatedCartItems;

  grandTotal = this.cart.items.map(cp => cp.subTotalPrice);  // []
  grandTotal.forEach(sub => grandTotalPriceVar += sub); // int
  this.cart.grandTotalPrice = grandTotalPriceVar;

  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [], grandTotalPrice: 0 };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
