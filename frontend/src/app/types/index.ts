// User types
export interface User {
  _id: string;
  username: string;
  email: string;
  token?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Note types
export interface Note {
  _id: string;
  title: string;
  content: string;
  subject: string;
  fileUrl?: string;
  fileType?: 'pdf' | 'image' | 'text' | 'other';
  summary?: string;
  user: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteState {
  notes: Note[];
  currentNote: Note | null;
  subjects: string[];
  loading: boolean;
  error: string | null;
}

// Flashcard types
export interface Flashcard {
  _id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  nextReview?: string;
  reviewCount: number;
  user: string;
  noteId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardState {
  flashcards: Flashcard[];
  currentFlashcard: Flashcard | null;
  dailyFlashcards: Flashcard[];
  loading: boolean;
  error: string | null;
}

// AI types
export interface DailyQuestion {
  question: string;
  answer: string;
}

export interface AIState {
  dailyQuestions: DailyQuestion[];
  loading: boolean;
  error: string | null;
}