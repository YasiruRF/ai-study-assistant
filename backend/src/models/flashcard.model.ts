import mongoose, { Document, Schema } from 'mongoose';

export interface IFlashcard extends Document {
  question: string;
  answer: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  nextReview?: Date;
  reviewCount: number;
  user: mongoose.Types.ObjectId;
  noteId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FlashcardSchema = new Schema<IFlashcard>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    lastReviewed: {
      type: Date,
    },
    nextReview: {
      type: Date,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    noteId: {
      type: Schema.Types.ObjectId,
      ref: 'Note',
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for search functionality
FlashcardSchema.index({ question: 'text', answer: 'text', subject: 'text' });

const Flashcard = mongoose.model<IFlashcard>('Flashcard', FlashcardSchema);

export default Flashcard;