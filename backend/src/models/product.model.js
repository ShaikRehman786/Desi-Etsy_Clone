const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String }, // changed from images array
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isApproved: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productsSchema);
