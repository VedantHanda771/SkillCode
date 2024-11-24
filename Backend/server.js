const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET;

// Ensure environment variables are set
if (!SECRET_KEY || !process.env.MONGODB_URL) {
  console.error('Missing required environment variables.');
  process.exit(1);
}

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Ensure the temporary directory exists
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Schemas
const questionSchema = new mongoose.Schema({
  Q_name: { type: String, required: true },
  Q_explanation: { type: String, required: true },
  Q_input: { type: String, required: true },
  Q_output: { type: String, required: true },
  TypeOfQues: { type: String, required: true },
  Solved: { type: String, default: 'No' },
  Comp_name: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    U_name: { type: String, required: true },
    U_email: { type: String, required: true, unique: true },
    U_dob: { type: Date, required: true },
    password: { type: String, required: true },
    Status: { type: String, default: 'active' },
    softDelete: { type: String, default: 'no' },
  },
  { timestamps: true }
);

// Models
const Question = mongoose.model('Question', questionSchema);
const User = mongoose.model('User', userSchema);

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};

// Endpoint to execute code
app.post('/run', (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: 'Language and code are required.' });
  }

  const inputFilePath = path.join(tempDir, 'input.txt');
  const codeFilePath = path.join(tempDir, 'code');
  const timeoutDuration = 5000;

  // Write input to a file if provided
  if (input) fs.writeFileSync(inputFilePath, input);

  let command = '';
  if (language === 'javascript') {
    command = `node -e "${code.replace(/"/g, '\\"')}" < "${inputFilePath}"`;
  } else if (language === 'python') {
    fs.writeFileSync(`${codeFilePath}.py`, code);
    command = `python3 "${codeFilePath}.py" < "${inputFilePath}"`;
  } else if (language === 'cpp') {
    fs.writeFileSync(`${codeFilePath}.cpp`, code);
    command = `g++ "${codeFilePath}.cpp" -o "${codeFilePath}" && "${codeFilePath}" < "${inputFilePath}"`;
  } else if (language === 'java') {
    fs.writeFileSync(`${codeFilePath}.java`, code);
    command = `javac "${codeFilePath}.java" && java -cp "${tempDir}" code < "${inputFilePath}"`;
  } else {
    return res.status(400).json({ error: 'Unsupported language.' });
  }

  console.log(`Executing: ${command}`);
  const execProcess = exec(command, { timeout: timeoutDuration }, (error, stdout, stderr) => {
    try {
      // Cleanup temporary files
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
      console.error('Cleanup Error:', cleanupError.message);
    }

    if (error) {
      console.error('Execution Error:', stderr || error.message);
      return res.status(500).json({ error: stderr || error.message });
    }

    res.json({ output: stdout });
  });

  execProcess.on('timeout', () => {
    console.log('Code execution timed out.');
    res.status(408).json({ error: 'Code execution timed out.' });
    execProcess.kill();
  });
});

// Endpoint to fetch all questions
app.get('/problems', async (req, res) => {
  try {
    const problems = await Question.find();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch a single problem by name
app.get('/problems/:name', async (req, res) => {
  try {
    const problem = await Question.findOne({ Q_name: decodeURIComponent(req.params.name) });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
  const { U_name, U_email, U_dob, password } = req.body;

  try {
    const existingUser = await User.findOne({ U_email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ U_name, U_email, U_dob, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ U_id: newUser._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ U_name: username }, { U_email: username }],
    });
    if (!user) return res.status(400).json({ error: 'User not found.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({ U_id: user._id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Course Schema
const courseSchema = new mongoose.Schema({
  Course_id: { type: String, required: true, unique: true },
  Course_name: { type: String, required: true },
  Course_price: { type: Number, required: true },
  Course_description: { type: String, required: true },
  Status: { type: String, default: 'active' },
  SoftDelete: { type: String, default: 'no' },
});

// Course Model
const Course = mongoose.model('Course', courseSchema);

// Endpoint to fetch all courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({ SoftDelete: 'no', Status: 'active' }); // Fetch only active courses not soft-deleted
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch detailed information about a single course by ID
app.get('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findOne({ Course_id: req.params.id, SoftDelete: 'no' });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
