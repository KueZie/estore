import jwt from 'jsonwebtoken';

const generateToken = (userId, duration) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: duration,
  });
}

export const generateAndSetToken = (res, userId, duration = '7 days') => {
  const token = generateToken(userId, duration);
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  return token;
} 