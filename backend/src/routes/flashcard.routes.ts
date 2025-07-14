import express from 'express';
import { 
  createFlashcard, 
  getFlashcards, 
  getFlashcardById, 
  updateFlashcard, 
  deleteFlashcard,
  reviewFlashcard,
  getDailyFlashcards,
  generateFlashcardsFromNote
} from '../controllers/flashcard.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get daily flashcards
router.get('/daily', getDailyFlashcards);

// Generate flashcards from note
router.post('/generate/:noteId', generateFlashcardsFromNote);

// CRUD operations
router.route('/')
  .post(createFlashcard)
  .get(getFlashcards);

router.route('/:id')
  .get(getFlashcardById)
  .put(updateFlashcard)
  .delete(deleteFlashcard);

// Review flashcard
router.put('/:id/review', reviewFlashcard);

export default router;