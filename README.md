# Talk To Me: AI-Powered Language Learning App

## Overview

Talk To Me is an innovative language learning application that leverages AI technology to provide real-time speech recognition, transcription, and personalized feedback. It's designed to help users practice and improve their language skills through interactive speaking exercises, AI-driven tutoring, and peer-to-peer communication.

## Features

- Real-time speech recognition for multiple languages
- Audio file upload and transcription using OpenAI's Whisper model
- AI-powered feedback on speech content, focusing on structure, grammar, vocabulary, and tone
- Support for practicing in one language and receiving feedback in another
- User-friendly interface built with React and styled with Tailwind CSS
- User authentication system
- Tutor-student matching system
- Real-time messaging between tutors and students
- Floating chat icon with unread message notifications

## Technologies Used

- Frontend: React, Tailwind CSS, React Query, Socket.io-client
- Backend: Node.js, Express, MongoDB, Mongoose, Socket.io
- APIs: OpenAI API (GPT-3.5 Turbo for feedback, Whisper for transcription)
- Speech Recognition: Web Speech API
- Authentication: JSON Web Tokens (JWT)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (usually comes with Node.js)
- MongoDB
- An OpenAI API key

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/KinTatHo/talk-to-me
   cd talk-to-me
   ```

2. Set up the backend:
   ```
   cd backend
   npm install
   ```
   Create a `.env` file in the backend directory and add your OpenAI API key and MongoDB connection string:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

4. Start the backend server:
   ```
   cd ../backend
   node server.js
   ```

5. In a new terminal, start the frontend development server:
   ```
   cd ../frontend
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000` to use the app.

## Usage

1. Sign up for an account or log in if you already have one.
2. Select your role (student, tutor, or both) and your learning/teaching languages.
3. Use the practice feature to improve your language skills:
   - Select your practice language from the dropdown menu.
   - Choose the language you want to receive feedback in.
   - Click the "Start Listening" button and begin speaking in your chosen practice language.
   - Alternatively, upload an audio file for transcription.
   - Once you have a transcript, click "Get AI Feedback" to receive personalized feedback on your speech.
4. Use the tutor-student matching system to find language partners.
5. Communicate with your language partners using the real-time messaging system.
6. Access your messages anytime using the floating chat icon.

## Project Structure

```
talk-to-me/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Practice.js
│   │   │   ├── FloatingChatIcon.js
│   │   │   ├── MessageList.js
│   │   │   └── UserInfo.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── SignUp.js
│   │   │   └── Dashboard.js
│   │   ├── contexts/
│   │   │   └── UserContext.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## New Backend Features

1. User Authentication: Implemented using JSON Web Tokens (JWT) for secure user sessions.
2. User Roles: Support for student, tutor, and combined roles.
3. Messaging System: Real-time messaging between users using Socket.io.
4. Unread Message Tracking: Keeps track of unread messages for each user.
5. Tutor-Student Matching: API endpoints for finding and connecting with language partners.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- OpenAI for providing the GPT-3.5 Turbo and Whisper models
- The React and Tailwind CSS communities for their excellent documentation and tools
- Socket.io for enabling real-time communication
- MongoDB for robust data storage

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

---

Happy language learning with Talk To Me!