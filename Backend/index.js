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

const authenticateJWT = (req, res, next) => {
  // Extract the token from the "Authorization" header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Supports both `null` and undefined cases

  // Check if token is provided
  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }

    // Attach the decoded user information to the request object
    req.user = decodedUser;
    next();
  });
};



app.get("/", (req, res) => {
  res.send("CheatCode Backend API");
});

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

app.post('/admin/addquestion', async (req, res) => {
  const {
    Q_name,
    Q_explanation,
    Q_input,
    Q_output,
    TypeOfQues,
    Solved,
    Comp_name,
    Difficulty
  } = req.body;

  // Validate required fields
  if (!Q_name || !Q_explanation || !Q_input || !Q_output || !TypeOfQues || !Comp_name || !Difficulty) {
    return res.status(400).send({ error: 'All fields are required' });
  }

  // Create a new question object
  const newQuestion = {
    Q_name,
    Q_explanation,
    Q_input,
    Q_output,
    TypeOfQues,
    Solved: Solved || false, // Default to false if not provided
    Comp_name,
    Difficulty,
  };

  try {
    // Insert the new question into the database
    const result = await db.collection('Questions').insertOne(newQuestion);

    // Send success response
    res.status(201).send({
      message: 'Question added successfully',
      question: { ...newQuestion, _id: result.insertedId },
    });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).send({ error: 'Failed to add question' });
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

app.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Fetch user based on logged-in user's ID
    if (!user || user.softDelete === 'yes') {
      return res.status(404).json({ error: 'User not found' });
    }

    // Extracting only the required fields
    const { U_name, U_email, U_dob, Status } = user;
    res.json({ U_name, U_email, U_dob, Status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use(express.json()); // Middleware to parse JSON requests


app.put('/profile', authenticateJWT, async (req, res) => {
  const { U_name, U_email, U_dob, Status } = req.body;

  try {
    const user = await User.findById(req.user._id); // Find the user by ID
    if (!user || user.softDelete === 'yes') {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update only the fields provided in the request
    if (U_name) user.U_name = U_name;
    if (U_email) user.U_email = U_email;
    if (U_dob) user.U_dob = new Date(U_dob); // Ensure the date is correctly formatted
    if (Status) user.Status = Status;

    await user.save(); // Save changes to the database

    res.status(200).json({ message: 'Profile updated successfully' });
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

// Admin Endpoint to Add a Question
app.post('/questions', authenticateJWT, async (req, res) => {
  const { Q_name, Q_explanation, Q_input, Q_output, TypeOfQues, Solved, Comp_name } = req.body;

  try {
    const newQuestion = new Question({ Q_name, Q_explanation, Q_input, Q_output, TypeOfQues, Solved, Comp_name });
    await newQuestion.save();

    res.status(201).json({ message: 'Question added successfully', question: newQuestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/getUser/:username', (req, res) => {
  const { username } = req.params;

  // Validate the username parameter
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid username provided' });
  }

  console.log('Searching for user:', username);  // Debugging log

  User.findOne({ U_name: username })
    .then(user => {
      if (user) {
        res.json({ success: true, user });
      } else {
        console.log('User not found:', username);  // Debugging log
        res.status(404).json({ success: false, message: 'User not found' });
      }
    })
    .catch(err => {
      console.error('Error fetching user:', err);
      res.status(500).json({ success: false, message: 'Error fetching user data' });
    });
});




app.post('/submitCode', async (req, res) => {
  const { user, Q_id, code } = req.body;

  if (!user || !questionId || !code) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Save code to the database
    await CodeModel.create({
      user,
      Q_id,
      code,
      createdAt: new Date(),
    });
    res.status(200).json({ message: 'Code saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving code', error });
  }
});


// Endpoint to get the logged-in user's profile





// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
