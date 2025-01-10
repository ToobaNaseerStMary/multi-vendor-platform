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
  status: { type: String, enum: ['confirmed', 'processed', 'shipped', 'delivered', 'cancelled'], default: 'processed' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
