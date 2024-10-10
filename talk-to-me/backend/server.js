const express = require('express');
const multer = require('multer');
const OpenAI = require('openai');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

// Multer configuration with file filter
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const fileFilter = function(req, file, cb) {
  // Allowed ext
  const filetypes = /flac|m4a|mp3|mp4|mpeg|mpga|oga|ogg|wav|webm/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
''
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Unsupported file format. Supported formats: flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm');
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
}).single('audio');

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let users = [];
let sessions = {};

app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    if (users.find(user => user.username === username || user.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = { username, email, password: hashedPassword, role };
    users.push(newUser);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'An error occurred during signup' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const sessionId = Math.random().toString(36).substr(2, 9);
    sessions[sessionId] = { username: user.username, role: user.role };

    res.json({ sessionId, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

app.post('/api/logout', (req, res) => {
  const { sessionId } = req.body;
  if (sessions[sessionId]) {
    delete sessions[sessionId];
    res.json({ message: 'Logged out successfully' });
  } else {
    res.status(400).json({ error: 'Invalid session' });
  }
});

// Simple middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  const sessionId = req.headers['x-session-id'];
  if (sessions[sessionId]) {
    req.user = sessions[sessionId];
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.get('/api/protected', isAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.post('/api/get-feedback', async (req, res) => {
  try {
    const { transcript, language, feedbackLanguage } = req.body;
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are an expert language tutor for ${language}. Your task is to provide specific, constructive feedback on the following text. Focus on these areas:

        1. Structure: Evaluate the overall organization of ideas and sentences. Comment on coherence and flow.
        2. Grammar: Identify and explain any grammatical errors. Provide corrections and explanations.
        3. Vocabulary: Assess the range and appropriateness of vocabulary used. Suggest improvements or alternatives where applicable.
        4. Tone: Comment on the tone and register of the language. Is it appropriate for the context?

        Provide your feedback in a clear, organized manner. Do not repeat the original text. Instead, offer specific examples and suggestions for improvement. Be encouraging but thorough in your assessment.` },
        { role: "system", content: `Remember to provide your feedback STRICTLY in ${feedbackLanguage}.` },
        { role: "user", content: transcript }
      ],
    });
    res.json({ feedback: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while getting feedback' });
  }
});

app.post('/api/transcribe', (req, res) => {
  upload(req, res, async function(err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.toString() });
    }
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    console.log('File uploaded successfully:', req.file);
    console.log('File path:', req.file.path);
    console.log('File size:', req.file.size);
    console.log('File mime type:', req.file.mimetype);

    try {
      console.log('Attempting to transcribe file...');
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(req.file.path),
        model: "whisper-1",
        language: req.body.language || 'zh-CN' // Use the language sent from frontend, default to Chinese
      });
      console.log('Transcription successful');
      fs.unlinkSync(req.file.path); // Delete the temporary file
      res.json({ transcript: transcription.text });
    } catch (error) {
      console.error('Transcription error:', error);
      // Log the full error object
      console.error('Full error object:', JSON.stringify(error, null, 2));
      // Check if there's a response from OpenAI API
      if (error.response) {
        console.error('OpenAI API response:', error.response.data);
      }
      res.status(500).json({ 
        error: 'An error occurred while transcribing the audio',
        details: error.message,
        openAIError: error.response ? error.response.data : null
      });
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));