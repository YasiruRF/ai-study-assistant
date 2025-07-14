import { Request, Response } from 'express';
import { OpenAI } from 'openai';
import { ChatOpenAI } from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import Note from '../models/note.model';
import Flashcard from '../models/flashcard.model';
import path from 'path';
import fs from 'fs';

// Initialize OpenAI client
let openai: OpenAI | null = null;
let chatModel: ChatOpenAI | null = null;

// Only initialize if API key is available
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Initialize LangChain OpenAI client
  chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
}

// @desc    Summarize a note
// @route   POST /api/ai/summarize/:noteId
// @access  Private
export const summarizeNote = async (req: Request, res: Response) => {
  try {
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
    
    // Check if OpenAI is available
    if (!chatModel) {
      return res.status(503).json({ message: 'AI service is not available. Please set OPENAI_API_KEY in environment variables.' });
    }
    
    // Create prompt for summarization
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful AI assistant that summarizes educational content. Create a concise but comprehensive summary of the following note. Include key points, concepts, and important details. Format the summary with bullet points for main ideas and use markdown formatting."],
      ["user", `Title: ${note.title}\nSubject: ${note.subject}\nContent: ${note.content}`]
    ]);
    
    // Create chain
    const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());
    
    // Execute chain
    const summary = await chain.invoke({});
    
    // Update note with summary
    if (typeof summary === 'string') {
      note.summary = summary;
      await note.save();
    } else {
      throw new Error('Summary is not a string');
    }
    
    res.json({ summary });
  } catch (error: any) {
    console.error('Summarize note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Generate flashcards from a note
// @route   POST /api/ai/generate-flashcards/:noteId
// @access  Private
export const generateFlashcards = async (req: Request, res: Response) => {
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
    
    // Check if OpenAI is available
    if (!chatModel) {
      return res.status(503).json({ message: 'AI service is not available. Please set OPENAI_API_KEY in environment variables.' });
    }
    
    // Create prompt for flashcard generation
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a helpful AI assistant that creates educational flashcards. Generate ${count} flashcards based on the following note. Each flashcard should have a question and answer. Focus on key concepts, definitions, and important facts. Format your response as a JSON array of objects with 'question' and 'answer' fields.`],
      ["user", `Title: ${note.title}\nSubject: ${note.subject}\nContent: ${note.content}`]
    ]);
    
    // Create chain
    const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());
    
    // Execute chain
    const result = await chain.invoke({});
    
    // Parse the result (assuming it's JSON)
    let flashcards;
    try {
      if (typeof result === 'string') {
        flashcards = JSON.parse(result);
      } else {
        return res.status(500).json({ message: 'AI response is not a string' });
      }
    } catch (e) {
      return res.status(500).json({ message: 'Failed to parse AI response' });
    }
    
    // Create flashcards in database
    const createdFlashcards = await Promise.all(
      flashcards.map((card: any) => 
        Flashcard.create({
          question: card.question,
          answer: card.answer,
          subject: note.subject,
          user: req.user._id,
          noteId: note._id,
        })
      )
    );
    
    res.json(createdFlashcards);
  } catch (error: any) {
    console.error('Generate flashcards error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Generate daily questions
// @route   POST /api/ai/daily-questions
// @access  Private
export const generateDailyQuestions = async (req: Request, res: Response) => {
  try {
    const { subject, count = 3 } = req.body;
    
    // Get user's notes for the subject
    const query: any = { user: req.user._id };
    if (subject) {
      query.subject = subject;
    }
    
    const notes = await Note.find(query).sort({ createdAt: -1 }).limit(5);
    
    if (notes.length === 0) {
      return res.status(404).json({ message: 'No notes found for this subject' });
    }
    
    // Combine note content
    const combinedContent = notes.map(note => 
      `Title: ${note.title}\nContent: ${note.content}`
    ).join('\n\n');
    
    // Check if OpenAI is available
    if (!chatModel) {
      return res.status(503).json({ message: 'AI service is not available. Please set OPENAI_API_KEY in environment variables.' });
    }
    
    // Create prompt for daily questions
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", `You are a helpful AI assistant that creates educational questions for daily review. Generate ${count} challenging questions based on the following notes. These questions should test understanding and application of concepts, not just memorization. Format your response as a JSON array of objects with 'question' and 'answer' fields.`],
      ["user", combinedContent]
    ]);
    
    // Create chain
    const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());
    
    // Execute chain
    const result = await chain.invoke({});
    
    // Parse the result (assuming it's JSON)
    let questions;
    try {
      if (typeof result === 'string') {
        questions = JSON.parse(result);
      } else {
        return res.status(500).json({ message: 'AI response is not a string' });
      }
    } catch (e) {
      return res.status(500).json({ message: 'Failed to parse AI response' });
    }
    
    res.json(questions);
  } catch (error: any) {
    console.error('Generate daily questions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Extract text from PDF
// @route   POST /api/ai/extract-pdf
// @access  Private
export const extractPdfText = async (req: Request, res: Response) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Check if file is PDF
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext !== '.pdf') {
      return res.status(400).json({ message: 'File must be a PDF' });
    }
    
    // This would normally use a PDF extraction library or service
    // For now, we'll return a placeholder response
    res.json({
      message: 'PDF extraction endpoint ready. Will be implemented with PDF extraction library.',
      filename: req.file.filename
    });
  } catch (error: any) {
    console.error('Extract PDF error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};