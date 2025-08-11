import { verify } from 'jsonwebtoken';

// Middleware to verify JWT token and protect routes
export function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

export function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ message: 'Access denied, only admin allowed' });
  }
  next();
}