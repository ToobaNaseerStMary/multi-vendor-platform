const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const _ = require('lodash');
const sendEmail = require('../config/mailer');

// Signup API
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(err => err.msg)[0] });
    }

    const { username, email, password, role } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const newUser = new User({ username, email, password, role });
      newUser.isAdminApproved = true;

      // Save user and send admin approval email for admin signup
      await newUser.save();

      // if (role === 'admin') {
      //   // Send email to the admin for approval
      //   const adminApprovalLink = `${process.env.HOST}/api/auth/approve-admin/${newUser._id}`;
      //   await sendEmail({
      //     to: 'toobanaseer.tn01@gmail.com',
      //     subject: 'Admin Signup Approval',
      //     text: `New admin signup request. Click to approve: ${adminApprovalLink}`,
      //   });
      // }

      // Generate JWT token
      const token = newUser.generateAuthToken();
      const userObj = _.omit(newUser.toObject(), ['password']);
      res.status(201).json({ userObj, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};

// Login API
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Admin check
      if (user.role === 'admin' && !user.isAdminApproved) {
        return res.status(400).json({ message: 'Admin signup not approved yet' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = user.generateAuthToken();
      
      const userObj = _.omit(user.toObject(), ['password']);
      res.status(200).json({ userObj, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};

// Admin approval API
exports.adminApproval = async (req, res) => {
    const { userId } = req.params;

    try {
       const user = await User.findById(userId);
       if (!user || user.role !== 'admin') {
          return res.status(400).json({ message: 'Invalid request' });
       }

       user.isAdminApproved = true;
       await user.save();
       res.status(200).json({ message: 'Admin approved successfully' });
  } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Server error' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send password reset email
    const resetLink = `${process.env.HOST}/api/auth/reset-password/${resetToken}`;
    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    });

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password successfully updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    const { username, password, oldPassword } = req.body;

    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      if (password) {
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
          return res.status(400).json({ message: 'Old password is incorrect' });
        }
        user.password = password;
      }

      if (username) {
        user.username = username;
      }

      await user.save();
      const userObj = _.omit(user.toObject(), ['password']);
      res.status(200).json({ userObj });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        // Find the user by ID
        const user = await User.findById(req.user.id).select('-password'); // Exclude password field
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        const userObj = _.omit(user.toObject(), ['password']);
        res.status(200).json(userObj); // Send the user profile
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
      }
};
