const mongoose = require('mongoose');

// Define the Problem schema
const problemSchema = new mongoose.Schema({
    Q_name: { type: String, required: true },
    Q_explation: { type: String, required: true },
    Q_input: { type: String, required: true },
    Q_output: { type: String, required: true },
    TypeOfQues: { type: String, required: true },
    Solved: { type: String, required: true },
    Comp_name: { type: String, required: true },
}, { timestamps: true });

const ProblemModel = mongoose.model('Problem', problemSchema);

// Function to get all problems
const getProblems = async () => {
    try {
        return await ProblemModel.find();
    } catch (err) {
        throw new Error('Failed to retrieve problems from database');
    }
};

module.exports = { getProblems };
