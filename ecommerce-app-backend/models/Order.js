const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: false},
  ethTransactionHash: { type: String, required: false},
  account: { type: String, required: false },
  status: { type: String, enum: ['confirmed', 'processed', 'shipped', 'delivered', 'cancelled'], default: 'processed' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
