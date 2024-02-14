import bcrypt from 'bcryptjs';
import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import { generateAndSetToken } from '../utils/authUtils.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {

    generateAndSetToken(res, user._id); // Set token in cookie

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }

});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  if (user) {
    generateAndSetToken(res, user._id); // Set token in cookie

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  res.send('Delete user');
})

const updateUser = asyncHandler(async (req, res) => {
  const user = User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = user.save();

    generateAndSetToken(res, updatedUser._id); // Set token in cookie

    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
})

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getUsers = asyncHandler(async (req, res) => {
  res.send('Get users');
});

const getUserById = asyncHandler(async (req, res) => {
  res.send('Get user by ID');
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', 'none', {
    expires: new Date(0), // Set the expiration date to the past (to expire the cookie)
    httpOnly: true
  });

  res.status(200).json({ message: 'User logged out' });
});

export { authUser, registerUser, deleteUser, updateUser, getUserProfile, getUserById, getUsers, logoutUser};


