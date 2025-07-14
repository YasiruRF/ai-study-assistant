import { create } from 'zustand';
import { notesAPI } from '../services/api';
import { NoteState, Note } from '../types';

const useNoteStore = create<NoteState & {
  fetchNotes: (subject?: string, search?: string) => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  createNote: (noteData: FormData) => Promise<Note>;
  updateNote: (id: string, noteData: FormData) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  fetchSubjects: () => Promise<void>;
  clearCurrentNote: () => void;
}>((set, get) => ({
  notes: [],
  currentNote: null,
  subjects: [],
  loading: false,
  error: null,

  fetchNotes: async (subject, search) => {
    set({ loading: true, error: null });
    try {
      const response = await notesAPI.getNotes(subject, search);
      set({ notes: response.data, loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to fetch notes' 
      });
    }
  },

  fetchNoteById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await notesAPI.getNoteById(id);
      set({ currentNote: response.data, loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to fetch note' 
      });
    }
  },

  createNote: async (noteData) => {
    set({ loading: true, error: null });
    try {
      const response = await notesAPI.createNote(noteData);
      const newNote = response.data;
      set(state => ({ 
        notes: [newNote, ...state.notes], 
        loading: false 
      }));
      return newNote;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to create note' 
      });
      throw error;
    }
  },

  updateNote: async (id, noteData) => {
    set({ loading: true, error: null });
    try {
      const response = await notesAPI.updateNote(id, noteData);
      const updatedNote = response.data;
      set(state => ({ 
        notes: state.notes.map(note => 
          note._id === id ? updatedNote : note
        ),
        currentNote: updatedNote,
        loading: false 
      }));
      return updatedNote;
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to update note' 
      });
      throw error;
    }
  },

  deleteNote: async (id) => {
    set({ loading: true, error: null });
    try {
      await notesAPI.deleteNote(id);
      set(state => ({ 
        notes: state.notes.filter(note => note._id !== id),
        loading: false 
      }));
      if (get().currentNote?._id === id) {
        set({ currentNote: null });
      }
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to delete note' 
      });
      throw error;
    }
  },

  fetchSubjects: async () => {
    set({ loading: true, error: null });
    try {
      const response = await notesAPI.getSubjects();
      set({ subjects: response.data, loading: false });
    } catch (error: any) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to fetch subjects' 
      });
    }
  },

  clearCurrentNote: () => {
    set({ currentNote: null });
  },
}));

export default useNoteStore;