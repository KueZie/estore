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
  const returnPayload = await User.findByIdAndDelete(req.params.id);

  if (returnPayload) {
    res.status(200).json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
})


// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const userToUpdate = await User.findById(req.params.id);

  if (userToUpdate) {
    if (req.body.name) {
      userToUpdate.name = req.body.name;
    }
    if (req.body.email !== userToUpdate.email && req.body.email) { // Only update email if it's different
      userToUpdate.email = req.body.email;
    }
    if (req.body.password) { // Only update password if it was provided
      userToUpdate.password = req.body.password;
    }

    if (req.__user.isAdmin && req.body.isAdmin !== undefined) { // Only admin can update isAdmin
      userToUpdate.isAdmin = req.body.isAdmin;
    }

    console.log('updatedUser:', userToUpdate)
    const updatedUser = await userToUpdate.save();


    // If the user is updating their own profile, update the token in the cookie
    if (req.__user._id.toString() === updatedUser._id.toString()) {
      generateAndSetToken(res, updatedUser._id); // Set token in cookie
    }

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
  const user = await User.findById(req.__user._id);

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
  const users = await User.find({}).select('-password');
  res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', 'none', {
    expires: new Date(0), // Set the expiration date to the past (to expire the cookie)
    httpOnly: true
  });

  res.status(200).json({ message: 'User logged out' });
});

export { authUser, registerUser, deleteUser, updateUser, getUserProfile, getUserById, getUsers, logoutUser};


