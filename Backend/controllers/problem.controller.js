const Question = require('../models/Question');

exports.getAllProblems = async (req,res) =>{
    try {
        const problems = await Question.find();
        res.json(problems);
    } catch(error){
        res.status(500).json({error : error.message});
    }
};

exports.getProblemByName = async(req,res) =>{
    try{
        const problem = await Question.findOne({
            Q_name: decodeURIComponent(req.params.name)
        });
        if(!problem){
            res.status(404).json({error : "Problem not found"});
        }
        res.json(problem);
    } catch(error){
        res.status(500).json({error: error.message});
    }
};