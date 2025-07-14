import { Request, Response } from 'express';
import Note, { INote } from '../models/note.model';
import path from 'path';
import fs from 'fs';

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content, subject, tags } = req.body;
    
    // Handle file upload if present
    let fileUrl = '';
    let fileType = '';
    
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      const ext = path.extname(req.file.originalname).toLowerCase();
      
      if (['.pdf'].includes(ext)) {
        fileType = 'pdf';
      } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        fileType = 'image';
      } else if (['.txt', '.md', '.doc', '.docx'].includes(ext)) {
        fileType = 'text';
      } else {
        fileType = 'other';
      }
    }

    const note = await Note.create({
      title,
      content,
      subject,
      fileUrl: fileUrl || undefined,
      fileType: fileType || undefined,
      tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
      user: req.user._id,
    });

    res.status(201).json(note);
  } catch (error: any) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all notes for a user
// @route   GET /api/notes
// @access  Private
export const getNotes = async (req: Request, res: Response) => {
  try {
    const { subject, search } = req.query;
    const query: any = { user: req.user._id };
    
    // Filter by subject if provided
    if (subject) {
      query.subject = subject;
    }
    
    // Search in title, content, and tags if search term provided
    if (search) {
      query.$text = { $search: search as string };
    }
    
    const notes = await Note.find(query).sort({ createdAt: -1 });
    
    res.json(notes);
  } catch (error: any) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
// @access  Private
export const getNoteById = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this note' });
    }
    
    res.json(note);
  } catch (error: any) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = async (req: Request, res: Response) => {
  try {
    const { title, content, subject, tags, summary } = req.body;
    
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this note' });
    }
    
    // Handle file upload if present
    let fileUrl = note.fileUrl;
    let fileType = note.fileType;
    
    if (req.file) {
      // Delete old file if exists
      if (note.fileUrl) {
        const oldFilePath = path.join(__dirname, '../../', note.fileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      fileUrl = `/uploads/${req.file.filename}`;
      const ext = path.extname(req.file.originalname).toLowerCase();
      
      if (['.pdf'].includes(ext)) {
        fileType = 'pdf';
      } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        fileType = 'image';
      } else if (['.txt', '.md', '.doc', '.docx'].includes(ext)) {
        fileType = 'text';
      } else {
        fileType = 'other';
      }
    }
    
    // Update note
    note.title = title || note.title;
    note.content = content || note.content;
    note.subject = subject || note.subject;
    note.fileUrl = fileUrl;
    note.fileType = fileType;
    note.summary = summary || note.summary;
    
    if (tags) {
      note.tags = tags.split(',').map((tag: string) => tag.trim());
    }
    
    const updatedNote = await note.save();
    
    res.json(updatedNote);
  } catch (error: any) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to user
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this note' });
    }
    
    // Delete file if exists
    if (note.fileUrl) {
      const filePath = path.join(__dirname, '../../', note.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await note.deleteOne();
    
    res.json({ message: 'Note removed' });
  } catch (error: any) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all subjects for a user
// @route   GET /api/notes/subjects
// @access  Private
export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await Note.distinct('subject', { user: req.user._id });
    res.json(subjects);
  } catch (error: any) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};