const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // Product category
  product_category: { type: String, required: true }, // Additional category for products
  images: [{
    url: { type: String, required: true }, // Image URL
    public_id: { type: String, required: true } // Cloudinary public_id for deletion
  }],
});

module.exports = mongoose.model('Product', productSchema);
