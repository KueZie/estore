import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import products from './data/products.js';
import { connectDB } from './config/db.js';

import { notFound, errorHandler } from './middleware/errorHandler.js';

import productRouter from './routes/productRoutes.js';

const port = process.env.PORT || 5000;

connectDB(); // Connect Database

const app = express();

app.get('/', (req, res) => {
  res.send('API is running...')
})

// Use productRoutes
app.use('/api/products', productRouter);

app.use(notFound); 
app.use(errorHandler); 


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})