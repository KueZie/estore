import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
    });

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
// @route   GET /api/users/login
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = User.create({ name, email, password });

  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    });

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
  res.send('Update user');
})

const getUserProfile = asyncHandler(async (req, res) => {
  res.send('Get user profile');
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


