import { Request, Response } from 'express';
import Flashcard, { IFlashcard } from '../models/flashcard.model';
import Note from '../models/note.model';

// @desc    Create a new flashcard
// @route   POST /api/flashcards
// @access  Private
export const createFlashcard = async (req: Request, res: Response) => {
  try {
    const { question, answer, subject, difficulty, noteId } = req.body;
    
    // Create flashcard
    const flashcard = await Flashcard.create({
      question,
      answer,
      subject,
      difficulty: difficulty || 'medium',
      noteId: noteId || undefined,
      user: req.user._id,
    });
    
    res.status(201).json(flashcard);
  } catch (error: any) {
    console.error('Create flashcard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all flashcards for a user
// @route   GET /api/flashcards
// @access  Private
export const getFlashcards = async (req: Request, res: Response) => {
  try {
    const { subject, difficulty, search, dueOnly } = req.query;
    const query: any = { user: req.user._id };
    
    // Filter by subject if provided
    if (subject) {
      query.subject = subject;
    }
    
    // Filter by difficulty if provided
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    // Filter by due cards only
    if (dueOnly === 'true') {
      query.$or = [
        { nextReview: { $lte: new Date() } },
        { nextReview: { $exists: false } }
      ];
    }
    
    // Search in question and answer if search term provided
    if (search) {
      query.$text = { $search: search as string };
    }
    
    const flashcards = await Flashcard.find(query).sort({ createdAt: -1 });
    
    res.json(flashcards);
  } catch (error: any) {
    console.error('Get flashcards error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single flashcard by ID
// @route   GET /api/flashcards/:id
// @access  Private
export const getFlashcardById = async (req: Request, res: Response) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    
    // Check if flashcard belongs to user
    if (flashcard.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this flashcard' });
    }
    
    res.json(flashcard);
  } catch (error: any) {
    console.error('Get flashcard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a flashcard
// @route   PUT /api/flashcards/:id
// @access  Private
export const updateFlashcard = async (req: Request, res: Response) => {
  try {
    const { question, answer, subject, difficulty } = req.body;
    
    const flashcard = await Flashcard.findById(req.params.id);
    
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    
    // Check if flashcard belongs to user
    if (flashcard.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this flashcard' });
    }
    
    // Update flashcard
    flashcard.question = question || flashcard.question;
    flashcard.answer = answer || flashcard.answer;
    flashcard.subject = subject || flashcard.subject;
    flashcard.difficulty = difficulty || flashcard.difficulty;
    
    const updatedFlashcard = await flashcard.save();
    
    res.json(updatedFlashcard);
  } catch (error: any) {
    console.error('Update flashcard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a flashcard
// @route   DELETE /api/flashcards/:id
// @access  Private
export const deleteFlashcard = async (req: Request, res: Response) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);
    
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    
    // Check if flashcard belongs to user
    if (flashcard.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this flashcard' });
    }
    
    await flashcard.deleteOne();
    
    res.json({ message: 'Flashcard removed' });
  } catch (error: any) {
    console.error('Delete flashcard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update flashcard review status
// @route   PUT /api/flashcards/:id/review
// @access  Private
export const reviewFlashcard = async (req: Request, res: Response) => {
  try {
    const { difficulty } = req.body;
    
    const flashcard = await Flashcard.findById(req.params.id);
    
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    
    // Check if flashcard belongs to user
    if (flashcard.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to review this flashcard' });
    }
    
    // Update review data
    flashcard.lastReviewed = new Date();
    flashcard.reviewCount += 1;
    
    // Calculate next review date based on difficulty and spaced repetition algorithm
    const now = new Date();
    let daysToAdd = 1;
    
    if (difficulty === 'easy') {
      // For easy cards, increase interval more
      daysToAdd = Math.max(1, flashcard.reviewCount * 2);
    } else if (difficulty === 'medium') {
      // For medium cards, increase interval moderately
      daysToAdd = Math.max(1, flashcard.reviewCount);
    } else {
      // For hard cards, reset to short interval
      daysToAdd = 1;
    }
    
    const nextReview = new Date(now);
    nextReview.setDate(nextReview.getDate() + daysToAdd);
    flashcard.nextReview = nextReview;
    
    const updatedFlashcard = await flashcard.save();
    
    res.json(updatedFlashcard);
  } catch (error: any) {
    console.error('Review flashcard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get flashcards for daily review
// @route   GET /api/flashcards/daily
// @access  Private
export const getDailyFlashcards = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    
    // Get flashcards due for review
    const dueFlashcards = await Flashcard.find({
      user: req.user._id,
      $or: [
        { nextReview: { $lte: now } },
        { nextReview: { $exists: false } }
      ]
    }).limit(20);
    
    // If we don't have enough due flashcards, get some random ones
    if (dueFlashcards.length < 10) {
      const additionalCount = 10 - dueFlashcards.length;
      const additionalFlashcards = await Flashcard.find({
        user: req.user._id,
        _id: { $nin: dueFlashcards.map(f => f._id) }
      }).sort({ lastReviewed: 1 }).limit(additionalCount);
      
      return res.json([...dueFlashcards, ...additionalFlashcards]);
    }
    
    res.json(dueFlashcards);
  } catch (error: any) {
    console.error('Get daily flashcards error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Generate flashcards from a note
// @route   POST /api/flashcards/generate/:noteId
// @access  Private
export const generateFlashcardsFromNote = async (req: Request, res: Response) => {
  try {
    const { count = 5 } = req.body;
    const noteId = req.params.noteId;
    
    // Find the note
    const note = await Note.findById(noteId);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this note' });
    }
    
    // This would normally call an AI service to generate flashcards
    // For now, we'll return a placeholder response
    res.json({
      message: 'Flashcard generation endpoint ready. Will be implemented with AI service.',
      noteId,
      requestedCount: count
    });
  } catch (error: any) {
    console.error('Generate flashcards error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};