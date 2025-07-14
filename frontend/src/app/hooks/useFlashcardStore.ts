import { create } from 'zustand';
import { flashcardsAPI, aiAPI } from '../services/api';
import { FlashcardState, Flashcard } from '../types';

const useFlashcardStore = create<FlashcardState & {
  fetchFlashcards: (subject?: string, difficulty?: string, search?: string, dueOnly?: boolean) => Promise<void>;
  fetchFlashcardById: (id: string) => Promise<void>;
  createFlashcard: (flashcardData: any) => Promise<Flashcard>;
  updateFlashcard: (id: string, flashcardData: any) => Promise<Flashcard>;
  deleteFlashcard: (id: string) => Promise<void>;
  reviewFlashcard: (id: string, difficulty: string) => Promise<Flashcard>;
  fetchDailyFlashcards: () => Promise<void>;
  generateFlashcards: (noteId: string, count?: number) => Promise<Flashcard[]>;
  clearCurrentFlashcard: () => void;
}>((set, get) => ({
  flashcards: [],
  currentFlashcard: null,
  dailyFlashcards: [],
  loading: false,
  error: null,

  fetchFlashcards: async (subject, difficulty, search, dueOnly) => {
    set({ loading: true, error: null });
    try {
      const response = await flashcardsAPI.getFlashcards(subject, difficulty, search, dueOnly);
      set({ flashcards: response.data, loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to fetch flashcards' 
      });
    }
  },

  fetchFlashcardById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await flashcardsAPI.getFlashcardById(id);
      set({ currentFlashcard: response.data, loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to fetch flashcard' 
      });
    }
  },

  createFlashcard: async (flashcardData) => {
    set({ loading: true, error: null });
    try {
      const response = await flashcardsAPI.createFlashcard(flashcardData);
      const newFlashcard = response.data;
      set(state => ({ 
        flashcards: [newFlashcard, ...state.flashcards], 
        loading: false 
      }));
      return newFlashcard;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to create flashcard' 
      });
      throw error;
    }
  },

  updateFlashcard: async (id, flashcardData) => {
    set({ loading: true, error: null });
    try {
      const response = await flashcardsAPI.updateFlashcard(id, flashcardData);
      const updatedFlashcard = response.data;
      set(state => ({ 
        flashcards: state.flashcards.map(flashcard => 
          flashcard._id === id ? updatedFlashcard : flashcard
        ),
        currentFlashcard: updatedFlashcard,
        loading: false 
      }));
      return updatedFlashcard;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to update flashcard' 
      });
      throw error;
    }
  },

  deleteFlashcard: async (id) => {
    set({ loading: true, error: null });
    try {
      await flashcardsAPI.deleteFlashcard(id);
      set(state => ({ 
        flashcards: state.flashcards.filter(flashcard => flashcard._id !== id),
        loading: false 
      }));
      if (get().currentFlashcard?._id === id) {
        set({ currentFlashcard: null });
      }
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to delete flashcard' 
      });
      throw error;
    }
  },

  reviewFlashcard: async (id, difficulty) => {
    set({ loading: true, error: null });
    try {
      const response = await flashcardsAPI.reviewFlashcard(id, difficulty);
      const reviewedFlashcard = response.data;
      set(state => ({ 
        flashcards: state.flashcards.map(flashcard => 
          flashcard._id === id ? reviewedFlashcard : flashcard
        ),
        dailyFlashcards: state.dailyFlashcards.map(flashcard => 
          flashcard._id === id ? reviewedFlashcard : flashcard
        ),
        currentFlashcard: reviewedFlashcard,
        loading: false 
      }));
      return reviewedFlashcard;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to review flashcard' 
      });
      throw error;
    }
  },

  fetchDailyFlashcards: async () => {
    set({ loading: true, error: null });
    try {
      const response = await flashcardsAPI.getDailyFlashcards();
      set({ dailyFlashcards: response.data, loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to fetch daily flashcards' 
      });
    }
  },

  generateFlashcards: async (noteId, count = 5) => {
    set({ loading: true, error: null });
    try {
      const response = await aiAPI.generateFlashcards(noteId, count);
      const newFlashcards = response.data;
      set(state => ({ 
        flashcards: [...newFlashcards, ...state.flashcards], 
        loading: false 
      }));
      return newFlashcards;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to generate flashcards' 
      });
      throw error;
    }
  },

  clearCurrentFlashcard: () => {
    set({ currentFlashcard: null });
  },
}));

export default useFlashcardStore;