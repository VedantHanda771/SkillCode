const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
    } catch(err){
        console.error('Error connecting to MongoDB', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;