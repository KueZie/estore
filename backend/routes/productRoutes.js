import express from 'express';

const router = express.Router();

import { 
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router
  .get('/', getProducts)
  .post('/', protect, admin, createProduct);
router.route('/top').get(getTopProducts);
router
  .get('/:id', getProductById)
  .put('/:id', protect, admin, updateProduct)
  .delete('/:id', protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);

export default router;