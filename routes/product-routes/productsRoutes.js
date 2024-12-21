const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const Product = require("../../models/products/Products")
const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary storage for images

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} = require("../../global/constants/keys")
// Cloudinary configuration
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// CREATE a product
// router.post('/upload/files', upload.single('image'), async (req, res) => {
//   try {
//     const { name, description, price } = req.body;
//     const file = req.file;

//     // Upload image to Cloudinary
//     const result = await cloudinary.uploader.upload(file.path);

//     // Save product
//     const product = new Product({
//       name,
//       description,
//       price,
//       image: result.secure_url,
//     });
//     await product.save();

//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

//CREATE a product with multiple images
router.post('/upload/files', upload.array('images', 10), async (req, res) => { // Max 10 images
  try {
    const { name, description, price, category, product_category } = req.body;
    const files = req.files;

    // Upload images to Cloudinary
    const imageUploadPromises = files.map(file => cloudinary.uploader.upload(file.path));
    const uploadResults = await Promise.all(imageUploadPromises);

    // Map the uploaded image results to store URLs and public_ids
    const images = uploadResults.map(result => ({
      url: result.secure_url,
      public_id: result.public_id
    }));

    // Save the product with multiple images
    const product = new Product({
      name,
      description,
      price,
      category,
      product_category,
      images // Store all image URLs and public_ids
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ all products
router.get('/get-products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE a product

// UPDATE Product with multiple images
router.put('/update/:id', upload.array('images', 10), async (req, res) => { // Max 10 images
    try {
      const { name, description, price, category, product_category } = req.body;
      const files = req.files;
  
      // Find the existing product by ID
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      let updatedData = { name, description, price, category, product_category };
  
      // If new images are uploaded, handle the image update
      if (files && files.length > 0) {
        // Delete old images from Cloudinary
        product.images.forEach(async (image) => {
          await cloudinary.uploader.destroy(image.public_id);
        });
  
        // Upload the new images to Cloudinary
        const imageUploadPromises = files.map(file => cloudinary.uploader.upload(file.path));
        const uploadResults = await Promise.all(imageUploadPromises);
  
        // Map the uploaded image results to store URLs and public_ids
        updatedData.images = uploadResults.map(result => ({
          url: result.secure_url,
          public_id: result.public_id
        }));
      }
  
      // Update the product with the new data
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
  
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


// DELETE Product and remove images from Cloudinary
router.delete('/delete/:id', async (req, res) => {
    try {
      // Find the product by its ID
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      // Remove images from Cloudinary using the stored public_ids
      for (const image of product.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }
  
      // Delete the product from the database
      await Product.findByIdAndDelete(req.params.id);
  
      res.status(200).json({ message: 'Product and images deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;
