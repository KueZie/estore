import asyncHandler from '../middleware/asyncHandler.js';
import { Product } from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Product.countDocuments({});
  const products = await Product
                          .find({})
                          .limit(pageSize)
                          .skip(pageSize * (page - 1));
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/product/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name');

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
    console.log('product:', product)
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

// @desc    Review a product
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = req.__user._id;
  const { rating, comment } = req.body;

  const review = {
    user,
    rating: Number(rating),
    comment
  }

  const product = await Product.findById(id);
  const alreadyReviewed = product.reviews.find(r => r.user.toString() === user.toString());

  if (!alreadyReviewed) {
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(400);
    throw new Error('Product already reviewed');
  }

})


export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
};