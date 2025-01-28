const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Signup Controller
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
};

// Function to send the email
const sendResetPasswordEmail = (user, token) => {
    const resetLink = `http://localhost:5000/api/auth/reset-password/${token}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your_email@example.com',
        pass: 'your_email_password',
      },
    });
  
    const mailOptions = {
      from: 'your_email@example.com',
      to: user.email,
      subject: 'Password Reset Request',
      text: `Please click the following link to reset your password: ${resetLink}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  };
  
  // Forgot password handler
  const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      // Generate a password reset token
      const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      // Send email with the reset link
      sendResetPasswordEmail(user, resetToken);
  
      return res.status(200).json({ message: 'Password reset link sent to email' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  };

  // Reset password handler
  const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Find the user by ID
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
  };

module.exports = { signup, login, forgotPassword, resetPassword};


