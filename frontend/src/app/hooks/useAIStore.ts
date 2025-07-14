import { create } from 'zustand';
import { aiAPI } from '../services/api';
import { AIState, DailyQuestion } from '../types';

const useAIStore = create<AIState & {
  summarizeNote: (noteId: string) => Promise<string>;
  generateDailyQuestions: (subject?: string, count?: number) => Promise<void>;
  extractPdfText: (fileData: FormData) => Promise<any>;
}>((set) => ({
  dailyQuestions: [],
  loading: false,
  error: null,

  summarizeNote: async (noteId) => {
    set({ loading: true, error: null });
    try {
      const response = await aiAPI.summarizeNote(noteId);
      set({ loading: false });
      return response.data.summary;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to summarize note' 
      });
      throw error;
    }
  },

  generateDailyQuestions: async (subject, count = 3) => {
    set({ loading: true, error: null });
    try {
      const response = await aiAPI.generateDailyQuestions(subject, count);
      set({ 
        dailyQuestions: response.data, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to generate daily questions' 
      });
      throw error;
    }
  },

  extractPdfText: async (fileData) => {
    set({ loading: true, error: null });
    try {
      const response = await aiAPI.extractPdfText(fileData);
      set({ loading: false });
      return response.data;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to extract PDF text' 
      });
      throw error;
    }
  },
}));

export default useAIStore;