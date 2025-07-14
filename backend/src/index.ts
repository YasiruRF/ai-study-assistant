import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Import routes
import authRoutes from './routes/auth.routes';
import noteRoutes from './routes/note.routes';
import flashcardRoutes from './routes/flashcard.routes';
import aiRoutes from './routes/ai.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();
const port = parseInt(process.env.PORT || '12001', 10);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/ai', aiRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/study-ai-assistant';
    
    if (process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI) {
      console.warn('MongoDB connection skipped in development mode without MONGODB_URI');
      return;
    }
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.warn('Continuing without MongoDB connection. Some features may not work.');
  }
};

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

export default app;