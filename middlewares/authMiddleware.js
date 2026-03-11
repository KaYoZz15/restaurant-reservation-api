const jwt = require('jsonwebtoken');
const db = require('../config/database');

function extractBearerToken(authorizationHeader) {
  if (!authorizationHeader || typeof authorizationHeader !== 'string') {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
}

async function authenticate(req, res, next) {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'Server configuration error'
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userId = Number(payload.userId || payload.id || payload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    const [users] = await db.query(
      'SELECT id, email, role FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token'
      });
    }

    req.user = users[0];
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token'
    });
  }
}

module.exports = {
  authenticate
};
