import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  res.send('Login');
});

// @desc    Register a new user
// @route   GET /api/users/login
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  res.send('Register user');
});

const deleteUser = asyncHandler(async (req, res) => {
  res.send('Delete user');
})

const updateUser = asyncHandler(async (req, res) => {
  res.send('Update user');
})

const getUserProfile = asyncHandler(async (req, res) => {
  res.send('Get user profile');
});

const getUserById = asyncHandler(async (req, res) => {
  res.send('Get user by ID');
});

const logoutUser = asyncHandler(async (req, res) => {
  res.send('Logout user');
});

export { authUser, registerUser, deleteUser, updateUser, getUserProfile, getUserById, logoutUser};


