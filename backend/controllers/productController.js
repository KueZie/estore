import asyncHandler from '../middleware/asyncHandler.js';
import { Product } from '../models/productModel.js';



// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/product/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  console.log('product:', product)

  if (product) {
    res.json(product);
    return;
  }

  res.status(404).json({ message: 'Product not found' });
});

export { getProducts, getProductById };