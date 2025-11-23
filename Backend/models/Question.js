const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        Q_name: { type: String, required: true },
        Q_explanation: { type: String, required: true },
        Q_input: { type: String, required: true },
        Q_output: { type:String, required: true },
        TypeOfQues:{ type: String, required: true },
        Solved:{ type: String, default: 'No'},
        Comp_name: { type: String, required: true },
    }
);

module.exports = mongoose.model('Question', questionSchema);