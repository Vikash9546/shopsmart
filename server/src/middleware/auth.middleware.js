const asyncHandler = require('../utils/asyncHandler');
const { verifyAccessToken } = require('../utils/jwt.util');
const User = require('../modules/user/user.model');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = verifyAccessToken(token);

    // Get user from token
    req.user = await User.findById(decoded.id);
    if (!req.user || req.user.status !== 'active') {
      return res.status(401).json({ success: false, message: 'User not found or account status restricted' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
});

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
