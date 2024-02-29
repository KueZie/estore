import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== 'production')
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

// Use productRoutes
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/upload', uploadRouter);

app.use('/api/config/paypal', (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID })); // PayPal Client ID

const __dirname = path.resolve(); // Set __dirname to the current working directory

if (process.env.NODE_ENV === 'production') {
  app.use('/uploads', express.static('/var/data/uploads')); // Make uploads folder static for production (images
  app.use(express.static(path.join(__dirname, '/frontend/build'))); // Set frontend build folder as static
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))); // Load index.html for any route not found
} else {
  app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); // Make uploads folder static for development
  app.get('/', (req, res) => {
    res.send('API is running...')
  })
}

app.use(notFound); 
app.use(errorHandler); 


app.listen(port, () => {
  console.log(`Server running in ${process.env.NODE_ENV} on port ${port}.`)
})