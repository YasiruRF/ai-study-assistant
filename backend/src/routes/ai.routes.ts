import express from 'express';
import { 
  summarizeNote, 
  generateFlashcards, 
  generateDailyQuestions,
  extractPdfText
} from '../controllers/ai.controller';
import { protect } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Summarize note
router.post('/summarize/:noteId', summarizeNote);

// Generate flashcards from note
router.post('/generate-flashcards/:noteId', generateFlashcards);

// Generate daily questions
router.post('/daily-questions', generateDailyQuestions);

// Extract text from PDF
router.post('/extract-pdf', upload.single('file'), extractPdfText);

export default router;