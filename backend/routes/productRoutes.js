import express from 'express';

const router = express.Router();

import { 
  getProducts,
  getProductById,
  createProduct,
  updateProduct
} from '../controllers/productController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router
  .get('/', getProducts)
  .post('/', protect, admin, createProduct);
router
  .get('/:id', getProductById)
  .put('/:id', protect, admin, updateProduct);

export default router;