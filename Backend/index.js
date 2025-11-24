const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const morgan = require('morgan');
const User = require('./models/User');
const Question = require('./models/Question');
const connectDB = require('./config/db');
const authenticateJWT  = require('./middleware/auth.middleware');

// const path = require('path');


// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET;

const _dirname = path.resolve();

// Ensure environment variables are set
if (!SECRET_KEY || !process.env.MONGODB_URL) {
  console.error('Missing required environment variables.');
  process.exit(1);
}



connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());



app.use(morgan('dev'));
// Models




const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}



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
    command = `javac "${codeFilePath}.java" && java -cp "${tempDir}" ${path.basename(codeFilePath)} < "${inputFilePath}"`;
  } else {
    return res.status(400).json({ error: 'Unsupported language.' });
  }

  console.log(`Executing: ${command}`);
  const execProcess = exec(command, { timeout: timeoutDuration }, (error, stdout, stderr) => {
    try {
      // Cleanup temporary files except input.txt
      if (language === 'python' && fs.existsSync(`${codeFilePath}.py`)) {
        fs.unlinkSync(`${codeFilePath}.py`);
      } else if (language === 'cpp') {
        if (fs.existsSync(`${codeFilePath}.cpp`)) fs.unlinkSync(`${codeFilePath}.cpp`);
        if (fs.existsSync(codeFilePath)) fs.unlinkSync(codeFilePath);
      } else if (language === 'java') {
        if (fs.existsSync(`${codeFilePath}.java`)) fs.unlinkSync(`${codeFilePath}.java`);
        if (fs.existsSync(path.join(tempDir, 'code.class'))) fs.unlinkSync(path.join(tempDir, 'code.class'));
      }
      // Do not delete input.txt anymore
      // if (input && fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
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
app.get('/api/problems', async (req, res) => {
  try {
    const problems = await Question.find();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to fetch a single problem by name
app.get('/api/problems/:name', async (req, res) => {
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

// Razorpay
const razorpay = new Razorpay({
    key_id: process.env.VITE_RAZORPAY_KEY_ID,
    key_secret: process.env.VITE_RAZORPAY_KEY_SECRET,
});




// Route to create a new order
app.post("/api/payment/create-order", async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // Amount in paise (₹1 = 100 paise)
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.json({ orderId: order.id });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Failed to create order" });
    }
});

// Route to verify payment (optional but good practice)
app.post("/api/payment/verify", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const crypto = require("crypto");

        const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature === razorpay_signature) {
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error verifying payment" });
    }
});





// Endpoint to get the logged-in user's profile

app.use(express.static(path.join(_dirname, '/Frontend/dist')));
app.get('*', (_,res) => {
  res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
