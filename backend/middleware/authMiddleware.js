import jwt from 'jsonwebtoken';
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log('decoded:', decoded);

    req.user = await User.findById(decoded.userId).select('-password');

    console.log('req.user:', req.user);

    next();
  } catch (error) {
    console.log('protect error:', error);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};