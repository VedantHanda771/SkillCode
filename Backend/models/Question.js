const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  Q_name: { type: String, required: true },
  Q_explanation: String,
  Q_input: String,
  Q_output: String,
  TypeOfQues: String,
  Sol: String,
  Company_name: String,
  Course_id: String,
  Status: { type: String, default: 'active' },
  SoftDelete: { type: Boolean, default: false }, // Field to mark if a question is soft deleted
}, { collection: 'Questions' }); // Explicitly setting the collection name

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
