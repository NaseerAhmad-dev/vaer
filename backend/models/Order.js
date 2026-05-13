const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:     { type: String, required: true },
  qty:      { type: Number, required: true, min: 1 },
  price:    { type: Number, required: true },
  image:    { type: String }
});

const orderSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:        [orderItemSchema],
  shippingAddress: {
    street: String, city: String, state: String, zip: String, country: String
  },
  paymentMethod:  { type: String, default: 'COD' },
  subtotal:       { type: Number, required: true },
  shippingPrice:  { type: Number, default: 0 },
  total:          { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  isPaid:         { type: Boolean, default: false },
  paidAt:         { type: Date },
  isDelivered:    { type: Boolean, default: false },
  deliveredAt:    { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
