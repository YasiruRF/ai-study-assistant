# StudyAI - Multi-Agent Note Taking App

A futuristic and responsive note-taking application with AI-powered features for summarization, flashcard generation, and study assistance.

## Features

- **Smart Note Organization**: Upload notes, PDFs, and images organized by subject
- **AI-Powered Summaries**: Automatically generate summaries of your notes and documents
- **Intelligent Flashcards**: Create and review flashcards with spaced repetition
- **Daily Review**: Get personalized daily questions to reinforce your learning
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- Next.js with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Zustand for state management
- React Hook Form for form handling
- Axios for API requests

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- OpenAI and LangChain for AI features

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/study-ai-assistant.git
cd study-ai-assistant
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# In the backend directory
cp .env.example .env
# Edit .env with your MongoDB URI and OpenAI API key
```

4. Start the development servers
```bash
# From the root directory
./start-dev.sh
```

## Deployment

### Frontend
The frontend can be deployed to Vercel:

```bash
cd frontend
vercel
```

### Backend
The backend can be deployed to a service like Heroku, Railway, or a VPS.

## License

MIT

## Acknowledgements

- OpenAI for the API
- Next.js team for the amazing framework
- All the open-source libraries used in this project