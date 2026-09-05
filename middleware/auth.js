const jwt = require('jsonwebtoken');

function createToken(user) {
  return jwt.sign(
    { id: user.id || user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || 'development-only-secret',
    { expiresIn: '7d' }
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'development-only-secret');
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

module.exports = { createToken, requireAuth };