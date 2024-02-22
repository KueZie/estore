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

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    rating: req.body.rating,
    countInStock: req.body.countInStock,
    numReviews: req.body.numReviews,
    description: req.body.description,
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);

});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Data to update can not be empty!' });
    return;
  }

  const id = req.params.id;

  if (!id) {
    res.status(400).send({ message: 'Id can not be empty!' });
    return;
  }

  const product = await Product.findById(id);

  if (product) {
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.image = req.body.image || product.image;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.countInStock = req.body.countInStock || product.countInStock;
    product.numReviews = req.body.numReviews || product.numReviews;
    product.description = req.body.description || product.description;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const data = await Product.deleteOne({ _id: id });
  
  if (data) {
    res.json({ message: 'Product was deleted successfully!' });
    return;
  }
  res.status(404).json({ message: `Cannot delete Product with id=${id}. Maybe Product was not found!` });
})

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};