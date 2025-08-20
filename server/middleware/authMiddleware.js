const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Rate limiting for failed auth attempts - More lenient approach
const authAttempts = new Map();

// Clean up old attempts periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of authAttempts.entries()) {
    // Remove attempts older than 1 hour
    if (now - data.timestamp > 60 * 60 * 1000) {
      authAttempts.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

// Middleware to verify user JWT token
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Check for rate limiting - More lenient
    const clientIP = req.ip || req.connection.remoteAddress;
    if (authAttempts.has(clientIP) && authAttempts.get(clientIP).count > 10) { // Increased from 5
      const timeDiff = Date.now() - authAttempts.get(clientIP).timestamp;
      if (timeDiff < 10 * 60 * 1000) { // Reduced from 15 minutes to 10 minutes
        return res.status(429).json({
          success: false,
          message: 'Too many failed authentication attempts. Please try again in 10 minutes.'
        });
      } else {
        authAttempts.delete(clientIP);
      }
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vision-fest-25-secret');
      
      // Check if token is not expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.'
        });
      }

      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        // Increment failed attempts
        if (authAttempts.has(clientIP)) {
          authAttempts.get(clientIP).count++;
        } else {
          authAttempts.set(clientIP, { count: 1, timestamp: Date.now() });
        }
        
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token. User not found.' 
        });
      }

      // Reset failed attempts on successful auth
      authAttempts.delete(clientIP);
      
      req.user = user;
      next();
    } catch (jwtError) {
      // Increment failed attempts
      if (authAttempts.has(clientIP)) {
        authAttempts.get(clientIP).count++;
      } else {
        authAttempts.set(clientIP, { count: 1, timestamp: Date.now() });
      }
      
      throw jwtError;
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token format.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please login again.' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication.' 
    });
  }
};

// Middleware to verify admin JWT token
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('🔐 Admin auth attempt:', { 
      hasToken: !!token, 
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 20) + '...',
      ip: req.ip || req.connection.remoteAddress
    });
    
    if (!token) {
      console.log('❌ No admin token provided');
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Check for rate limiting - More lenient for admin
    const clientIP = req.ip || req.connection.remoteAddress;
    if (authAttempts.has(clientIP) && authAttempts.get(clientIP).count > 5) { // Increased from 3
      const timeDiff = Date.now() - authAttempts.get(clientIP).timestamp;
      if (timeDiff < 15 * 60 * 1000) { // Reduced from 30 minutes to 15 minutes
        console.log('⚠️ Admin rate limited:', { ip: clientIP, count: authAttempts.get(clientIP).count });
        return res.status(429).json({
          success: false,
          message: 'Too many failed authentication attempts. Please try again in 15 minutes.'
        });
      } else {
        authAttempts.delete(clientIP);
      }
    }

    try {
      console.log('🔍 Verifying admin token...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vision-fest-25-secret');
      console.log('✅ Admin token verified:', { adminId: decoded.adminId, userType: decoded.userType });
      
      // Check if token is not expired
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        console.log('❌ Admin token expired');
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please login again.'
        });
      }

      const admin = await Admin.findById(decoded.adminId).select('-password');
      
      if (!admin) {
        console.log('❌ Admin not found in database:', decoded.adminId);
        // Increment failed attempts
        if (authAttempts.has(clientIP)) {
          authAttempts.get(clientIP).count++;
        } else {
          authAttempts.set(clientIP, { count: 1, timestamp: Date.now() });
        }
        
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token. Admin not found.' 
        });
      }
      
      console.log('✅ Admin authenticated successfully:', { username: admin.username, role: admin.role });

      // Reset failed attempts on successful auth
      authAttempts.delete(clientIP);
      
      req.admin = admin;
      next();
    } catch (jwtError) {
      console.log('❌ JWT verification failed:', { error: jwtError.message, name: jwtError.name });
      // Increment failed attempts
      if (authAttempts.has(clientIP)) {
        authAttempts.get(clientIP).count++;
      } else {
        authAttempts.set(clientIP, { count: 1, timestamp: Date.now() });
      }
      
      throw jwtError;
    }
  } catch (error) {
    console.log('❌ Admin auth error:', { name: error.name, message: error.message });
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token format.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please login again.' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication.' 
    });
  }
};

// Middleware to check if user is logged in (for public routes that need user info)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vision-fest-25-secret');
        
        // Check if token is not expired
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          // Token expired, but continue without user info
          return next();
        }
        
        const user = await User.findById(decoded.userId).select('-password');
        if (user) {
          req.user = user;
        }
      } catch (jwtError) {
        // Invalid token, but continue without user info
        console.log('Invalid token in optionalAuth:', jwtError.message);
      }
    }
    
    next();
  } catch (error) {
    // If any error occurs, just continue without user info
    next();
  }
};

module.exports = {
  authenticateUser,
  authenticateAdmin,
  optionalAuth
}; 