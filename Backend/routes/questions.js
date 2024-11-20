const express = require('express');
const Question = require('../models/Question');  // Updated model import
const router = express.Router();

// Get all questions
router.get('/questions', async (req, res) => {  // Updated endpoint
  try {
    const questions = await Question.find();  // Updated model name
    res.json(questions);  // Return questions as JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get a single question by ID
router.get('/questions/:id', async (req, res) => {  // Updated endpoint
  try {
    const question = await Question.findById(req.params.id);  // Updated model name
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);  // Return the question by ID
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
