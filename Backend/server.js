const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/CheatCode', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process if MongoDB connection fails
    });

// Create a temporary directory if it doesn't exist
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Define the Question schema
const questionSchema = new mongoose.Schema({
    Q_name: { type: String, required: true },
    Q_explanation: { type: String, required: true },
    Q_input: { type: String, required: true },
    Q_output: { type: String, required: true },
    TypeOfQues: { type: String, required: true },
    Solved: { type: String, default: 'No' },
    Comp_name: { type: String, required: true },
});

// Create the Question model
const Question = mongoose.model('Question', questionSchema);

// Endpoint to run code
app.post('/run', (req, res) => {
    const { language, code, input } = req.body;

    if (!language || !code) {
        return res.status(400).json({ error: 'Language and code are required.' });
    }

    const inputFilePath = path.join(tempDir, 'input.txt');
    const codeFilePath = path.join(tempDir, 'code');
    const timeoutDuration = 5000; // Timeout in ms (5 seconds)

    // Write input to a file
    if (input) {
        fs.writeFileSync(inputFilePath, input);
    }

    let command = '';

    // Determine the command based on the programming language
    if (language === 'javascript') {
        command = `node -e "${code.replace(/"/g, '\\"')}" < "${inputFilePath}"`;
    } else if (language === 'python') {
        fs.writeFileSync(`${codeFilePath}.py`, code);
        command = `python "${codeFilePath}.py" < "${inputFilePath}"`;
    } else if (language === 'cpp') {
        fs.writeFileSync(`${codeFilePath}.cpp`, code);
        command = `g++ "${codeFilePath}.cpp" -o "${codeFilePath}" && "${codeFilePath}" < "${inputFilePath}"`;
    } else if (language === 'java') {
        fs.writeFileSync(`${codeFilePath}.java`, code);
        command = `javac "${codeFilePath}.java" && java -cp "${tempDir}" code < "${inputFilePath}"`;
    } else {
        return res.status(400).json({ error: 'Unsupported language.' });
    }

    // Debugging: Log the command being executed
    console.log(`Executing command: ${command}`);

    // Execute the command with a timeout
    const execProcess = exec(command, { timeout: timeoutDuration }, (error, stdout, stderr) => {
        // Clean up temporary files
        try {
            if (language === 'python') fs.unlinkSync(`${codeFilePath}.py`);
            else if (language === 'cpp') {
                fs.unlinkSync(`${codeFilePath}.cpp`);
                fs.unlinkSync(codeFilePath);
            } else if (language === 'java') {
                fs.unlinkSync(`${codeFilePath}.java`);
                fs.unlinkSync(path.join(tempDir, 'code.class'));
            }
            if (input) fs.unlinkSync(inputFilePath);
        } catch (cleanupError) {
            console.error('Error during cleanup:', cleanupError.message);
        }

        // Handle execution errors
        if (error) {
            console.error('Execution error:', stderr || error.message);
            return res.status(500).json({ error: stderr || error.message });
        }

        res.json({ output: stdout });
    });

    // If the process takes too long, terminate it
    execProcess.on('timeout', () => {
        console.log('Code execution timed out.');
        res.status(408).json({ error: 'Code execution timed out.' });
        execProcess.kill(); // Kill the process
    });
});

// Endpoint to fetch all questions
app.get('/problems', async (req, res) => {
    try {
        const problems = await Question.find(); // Fetch all documents in the 'Questions' collection
        res.json(problems); // Respond with the list of problems
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({ message: 'Error fetching problems', error: error.message });
    }
});

// Endpoint to fetch a single problem by ID (used for the solve route)
app.get('/problems/:name', async (req, res) => {
    try {
        // Decode the name to handle URL-encoded values
        const problemName = decodeURIComponent(req.params.name);

        // Find the problem by Q_name (case-insensitive search)
        const problem = await Question.findOne({ Q_name: problemName });

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.json(problem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch problem' });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
