import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.js';

import { notFound, errorHandler } from './middleware/errorHandler.js';

import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';

const port = process.env.PORT || 5000;

connectDB(); // Connect Database

const app = express();

app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is running...')
})

// Use productRoutes
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);

app.use(notFound); 
app.use(errorHandler); 


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})