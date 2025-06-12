// backend/routes/feedback.js

const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST feedback
router.post('/send', async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ message: 'Email, subject, and message are required' });
  }

  try {
    const feedback = new Feedback({
      email,
      subject,
      message,
    });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send feedback' });
  }
});

// GET feedback by email
router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const feedbacks = await Feedback.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load feedbacks' });
  }
});

module.exports = router;
