import express from 'express';
import { 
  createNote, 
  getNotes, 
  getNoteById, 
  updateNote, 
  deleteNote,
  getSubjects
} from '../controllers/note.controller';
import { protect } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all subjects
router.get('/subjects', getSubjects);

// CRUD operations
router.route('/')
  .post(upload.single('file'), createNote)
  .get(getNotes);

router.route('/:id')
  .get(getNoteById)
  .put(upload.single('file'), updateNote)
  .delete(deleteNote);

export default router;