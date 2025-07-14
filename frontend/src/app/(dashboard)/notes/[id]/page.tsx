'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiArrowLeft, FiCpu, FiBook } from 'react-icons/fi';
import useNoteStore from '@/app/hooks/useNoteStore';
import useAIStore from '@/app/hooks/useAIStore';
import useFlashcardStore from '@/app/hooks/useFlashcardStore';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import ReactMarkdown from 'react-markdown';

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params.id as string;
  
  const { currentNote, fetchNoteById, deleteNote } = useNoteStore();
  const { summarizeNote } = useAIStore();
  const { generateFlashcards } = useFlashcardStore();
  
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNote = async () => {
      setLoading(true);
      try {
        await fetchNoteById(noteId);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load note');
        toast.error('Failed to load note');
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId, fetchNoteById]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      try {
        await deleteNote(noteId);
        toast.success('Note deleted successfully');
        router.push('/notes');
      } catch (err: any) {
        toast.error('Failed to delete note');
      }
    }
  };

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      await summarizeNote(noteId);
      await fetchNoteById(noteId); // Refresh note to get the summary
      toast.success('Note summarized successfully');
    } catch (err: any) {
      toast.error('Failed to summarize note');
    } finally {
      setSummarizing(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    setGeneratingFlashcards(true);
    try {
      const flashcards = await generateFlashcards(noteId, 5);
      toast.success(`${flashcards.length} flashcards generated successfully`);
    } catch (err: any) {
      toast.error('Failed to generate flashcards');
    } finally {
      setGeneratingFlashcards(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !currentNote) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Note not found</h2>
          <p className="text-gray-600 mb-6">{error || 'The note you are looking for does not exist or has been deleted.'}</p>
          <Link href="/notes">
            <Button icon={<FiArrowLeft />}>Back to Notes</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/notes" className="mr-4">
            <Button variant="outline" size="sm" icon={<FiArrowLeft />}>
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 truncate">{currentNote.title}</h1>
        </div>
        <div className="flex space-x-3">
          <Link href={`/notes/${noteId}/edit`}>
            <Button variant="outline" size="sm" icon={<FiEdit2 />}>
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            icon={<FiTrash2 />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Note Metadata */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2">
              {currentNote.subject}
            </span>
            {currentNote.tags && currentNote.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {format(new Date(currentNote.updatedAt), 'MMM d, yyyy')}
          </div>
        </div>
      </Card>

      {/* AI Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          variant="outline"
          size="sm"
          icon={<FiCpu />}
          onClick={handleSummarize}
          isLoading={summarizing}
        >
          {currentNote.summary ? 'Re-summarize' : 'Summarize'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon={<FiBook />}
          onClick={handleGenerateFlashcards}
          isLoading={generatingFlashcards}
        >
          Generate Flashcards
        </Button>
      </div>

      {/* Summary */}
      {currentNote.summary && (
        <Card className="mb-6 bg-indigo-50 border border-indigo-100">
          <h2 className="text-lg font-semibold text-indigo-900 mb-2">Summary</h2>
          <div className="text-indigo-800">
            <ReactMarkdown>{currentNote.summary}</ReactMarkdown>
          </div>
        </Card>
      )}

      {/* File Preview */}
      {currentNote.fileUrl && (
        <Card className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Attached File</h2>
          {currentNote.fileType === 'image' ? (
            <div className="border rounded-lg overflow-hidden">
              <img
                src={currentNote.fileUrl}
                alt={currentNote.title}
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
          ) : currentNote.fileType === 'pdf' ? (
            <div className="border rounded-lg p-4 bg-gray-50 text-center">
              <p className="text-gray-600 mb-2">PDF Document</p>
              <a
                href={currentNote.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Open PDF
              </a>
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-gray-50 text-center">
              <p className="text-gray-600 mb-2">Attached File</p>
              <a
                href={currentNote.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Download File
              </a>
            </div>
          )}
        </Card>
      )}

      {/* Note Content */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Content</h2>
        <div className="prose max-w-none">
          <ReactMarkdown>{currentNote.content}</ReactMarkdown>
        </div>
      </Card>
    </div>
  );
}