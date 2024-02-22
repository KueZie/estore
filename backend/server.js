import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

import cookieParser from 'cookie-parser';

import { connectDB } from './config/db.js';

import { notFound, errorHandler } from './middleware/errorHandler.js';

import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';
import orderRouter from './routes/orderRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';

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
app.use('/api/upload', uploadRouter);

app.use('/api/config/paypal', (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID })); // PayPal Client ID

const __dirname = path.resolve(); // Set __dirname to the current working directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); // Make uploads folder static

console.log(path.join(__dirname, '/uploads'))

app.use(notFound); 
app.use(errorHandler); 


app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})