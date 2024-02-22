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


    req.__user = await User.findById(decoded.userId).select('-password');

    console.log('[protect] req.user:', req.__user.email);

    next();
  } catch (error) {
    console.log('protect error:', error);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

export const admin = (req, res, next) => {
  console.log('Checking if user is admin:', req.__user);
  if (req.__user && req.__user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};