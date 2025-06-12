const express = require('express');
const router = express.Router();
const User = require('../models/User');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ✅ Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ✅ Optional: Check if the transporter is working
transporter.verify((error, success) => {
  if (error) {
    console.log('Error with mail transporter:', error);
  } else {
    console.log('Mail transporter ready');
  }
});

// ✅ Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

  try {
    let user = await User.findOne({ email });

    if (user) {
      user.otp = otp;
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    } else {
      user = new User({
        email,
        otp,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        verified: false
      });
    }

    await user.save();

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Your OTP for Incognito Inbox',
      text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending OTP', error: err.message });
  }
});

// ✅ Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  try {
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.verified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.status(200).json({ message: 'User verified successfully', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
});

// ✅ Register (optional after OTP verification)
router.post('/register', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });

    if (!user || !user.verified) {
      return res.status(400).json({ message: 'Please verify your email before registering' });
    }

    res.status(200).json({ message: 'Registration complete' });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

// ✅ Login (email must be verified)
router.post('/login', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });

    if (!user || !user.verified) {
      return res.status(401).json({ message: 'User not verified or does not exist' });
    }

    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
