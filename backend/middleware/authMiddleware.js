// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    console.log('\n🔐 [AUTH MIDDLEWARE] START');
    console.log('🔍 Headers:', req.headers);
    
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('✅ Token found:', token.substring(0, 20) + '...'); // Log first 20 chars
    } else {
      console.log('❌ No token found');
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    // Verify token
    console.log('🔑 Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified. Decoded:', decoded);
    
    req.user = decoded;
    console.log('✅ User attached to request:', req.user);
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);
    res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

export default authMiddleware;