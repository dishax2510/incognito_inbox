// backend/models/Feedback.js

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    subject: { type: String, required: true }, // Subject is now required
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
  