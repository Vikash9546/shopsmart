const User = require('../user/user.model');
const asyncHandler = require('../../utils/asyncHandler');
const { generateTokens, verifyRefreshToken } = require('../../utils/jwt.util');
const { z } = require('zod');

// Validation Schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['customer', 'seller']).optional().default('customer'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const validation = registerSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.format() });
  }

  const { name, email, password, role } = validation.data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists with this email' });
  }

  // Create user
  const user = await User.create({ name, email, password, role });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Update user with refresh token
  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    success: true,
    data: {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const validation = loginSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.format() });
  }

  const { email, password } = validation.data;

  // Find user and select password (since it's hidden by default)
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Update user with refresh token
  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    success: true,
    data: {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
      refreshToken,
    },
  });
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh token is required' });
  }

  // Find user with this refresh token
  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }

  // Verify refresh token
  try {
    const decoded = verifyRefreshToken(refreshToken);
    if (decoded.id !== user._id.toString()) {
      throw new Error('Unauthorized');
    }

    // Generate new tokens
    const tokens = generateTokens(user._id);

    // Update user with new refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Refresh token expired or invalid' });
  }
});

module.exports = {
  register,
  login,
  refresh,
};
