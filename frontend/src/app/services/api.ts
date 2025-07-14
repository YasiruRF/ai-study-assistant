import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (username: string, email: string, password: string) => 
    api.post('/auth/register', { username, email, password }),
  
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  getProfile: () => 
    api.get('/auth/profile'),
  
  updateProfile: (userData: any) => 
    api.put('/auth/profile', userData),
};

// Notes API
export const notesAPI = {
  getNotes: (subject?: string, search?: string) => 
    api.get('/notes', { params: { subject, search } }),
  
  getNoteById: (id: string) => 
    api.get(`/notes/${id}`),
  
  createNote: (noteData: FormData) => 
    api.post('/notes', noteData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  updateNote: (id: string, noteData: FormData) => 
    api.put(`/notes/${id}`, noteData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  deleteNote: (id: string) => 
    api.delete(`/notes/${id}`),
  
  getSubjects: () => 
    api.get('/notes/subjects'),
};

// Flashcards API
export const flashcardsAPI = {
  getFlashcards: (subject?: string, difficulty?: string, search?: string, dueOnly?: boolean) => 
    api.get('/flashcards', { params: { subject, difficulty, search, dueOnly } }),
  
  getFlashcardById: (id: string) => 
    api.get(`/flashcards/${id}`),
  
  createFlashcard: (flashcardData: any) => 
    api.post('/flashcards', flashcardData),
  
  updateFlashcard: (id: string, flashcardData: any) => 
    api.put(`/flashcards/${id}`, flashcardData),
  
  deleteFlashcard: (id: string) => 
    api.delete(`/flashcards/${id}`),
  
  reviewFlashcard: (id: string, difficulty: string) => 
    api.put(`/flashcards/${id}/review`, { difficulty }),
  
  getDailyFlashcards: () => 
    api.get('/flashcards/daily'),
  
  generateFlashcards: (noteId: string, count: number = 5) => 
    api.post(`/flashcards/generate/${noteId}`, { count }),
};

// AI API
export const aiAPI = {
  summarizeNote: (noteId: string) => 
    api.post(`/ai/summarize/${noteId}`),
  
  generateFlashcards: (noteId: string, count: number = 5) => 
    api.post(`/ai/generate-flashcards/${noteId}`, { count }),
  
  generateDailyQuestions: (subject?: string, count: number = 3) => 
    api.post('/ai/daily-questions', { subject, count }),
  
  extractPdfText: (fileData: FormData) => 
    api.post('/ai/extract-pdf', fileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export default api;