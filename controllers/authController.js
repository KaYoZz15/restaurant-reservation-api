const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildTokenPayload(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

function generateToken(user) {
  return jwt.sign(buildTokenPayload(user), process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
}

function sanitizeUser(user) {
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

function validateSignupBody(body) {
  const { email, password, fname, lname, phone } = body;

  if (!email || !password || !fname || !lname || !phone) {
    return 'email, password, fname, lname and phone are required';
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'email format is invalid';
  }

  if (String(password).length < 6) {
    return 'password must contain at least 6 characters';
  }

  return null;
}

async function signup(req, res) {
  try {
    const validationError = validateSignupBody(req.body);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const { email, password, fname, lname, phone } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await userModel.findByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account already exists with this email',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userModel.createUser({
      email: normalizedEmail,
      passwordHash,
      fname: String(fname).trim(),
      lname: String(lname).trim(),
      phone: String(phone).trim(),
      role: 'client',
    });

    return res.status(201).json({
      success: true,
      message: 'User account created successfully',
      data: sanitizeUser(newUser),
    });
  } catch (error) {
    console.error('signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email and password are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await userModel.findByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: sanitizeUser(user),
    });
  } catch (error) {
    console.error('login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

module.exports = {
  signup,
  login,
};
