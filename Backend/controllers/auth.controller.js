const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

exports.signup = async (req, res) =>{
    const {U_name, U_email, U_dob, password} = req.body;

    try {
        const existingUser = await User.findOne({U_email});
        if(existingUser) return res.status(400).json({error: "Email already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ U_name, U_email, U_dob, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign(
            {U_id : newUser._id},
            SECRET_KEY,
            {expiresIn: "1h"}
        );

        res.status(201).json({ message: 'User created sucessfully', token });
    }catch(error) {
        res.status(500).json({error: error.message});
    }
}