'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiBook, FiCpu, FiFileText, FiPlus, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import useAuthStore from '@/app/hooks/useAuthStore';
import useNoteStore from '@/app/hooks/useNoteStore';
import useFlashcardStore from '@/app/hooks/useFlashcardStore';
import useAIStore from '@/app/hooks/useAIStore';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { Note, Flashcard } from '@/app/types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { notes, fetchNotes } = useNoteStore();
  const { flashcards, dailyFlashcards, fetchDailyFlashcards } = useFlashcardStore();
  const { dailyQuestions, generateDailyQuestions } = useAIStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchNotes(),
          fetchDailyFlashcards(),
          generateDailyQuestions()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchNotes, fetchDailyFlashcards, generateDailyQuestions]);

  const recentNotes = notes.slice(0, 3);
  const dueFlashcards = dailyFlashcards.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username || 'Student'}!
        </h1>
        <p className="text-gray-600 mt-2">
          {format(new Date(), 'EEEE, MMMM d, yyyy')} • Your study dashboard
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white/20 mr-4">
              <FiFileText size={24} />
            </div>
            <div>
              <p className="text-white/80 text-sm">Total Notes</p>
              <h3 className="text-2xl font-bold">{notes.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white/20 mr-4">
              <FiBook size={24} />
            </div>
            <div>
              <p className="text-white/80 text-sm">Flashcards</p>
              <h3 className="text-2xl font-bold">{flashcards.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white/20 mr-4">
              <FiClock size={24} />
            </div>
            <div>
              <p className="text-white/80 text-sm">Due for Review</p>
              <h3 className="text-2xl font-bold">{dueFlashcards.length}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Notes */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Notes</h2>
            <Link href="/notes">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : recentNotes.length > 0 ? (
            <div className="space-y-4">
              {recentNotes.map((note: Note) => (
                <Link href={`/notes/${note._id}`} key={note._id}>
                  <Card
                    hoverable
                    className="border border-gray-200 hover:border-indigo-200 transition-all"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{note.title}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {note.summary || note.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {note.subject}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {format(new Date(note.updatedAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      {note.fileType && (
                        <div className="ml-4 flex-shrink-0">
                          {note.fileType === 'pdf' ? (
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <FiFileText className="text-red-500" />
                            </div>
                          ) : note.fileType === 'image' ? (
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FiFileText className="text-blue-500" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FiFileText className="text-gray-500" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}

              <Link href="/notes/new">
                <Card
                  hoverable
                  className="border border-dashed border-gray-300 hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-center justify-center py-4">
                    <FiPlus className="mr-2 text-indigo-500" />
                    <span className="text-indigo-500 font-medium">Add New Note</span>
                  </div>
                </Card>
              </Link>
            </div>
          ) : (
            <Card className="border border-gray-200 bg-gray-50">
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">You don't have any notes yet</p>
                <Link href="/notes/new">
                  <Button icon={<FiPlus />}>Create Your First Note</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Daily Review */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Daily Review</h2>
            <Link href="/daily-review">
              <Button variant="outline" size="sm">
                Start Review
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              {dueFlashcards.length > 0 ? (
                <Card className="mb-6 border border-purple-200 bg-purple-50">
                  <h3 className="font-medium text-purple-800 mb-3">
                    Flashcards Due Today
                  </h3>
                  <div className="space-y-2">
                    {dueFlashcards.map((flashcard: Flashcard) => (
                      <div
                        key={flashcard._id}
                        className="p-3 bg-white rounded-md shadow-sm border border-purple-100"
                      >
                        <p className="font-medium text-gray-800">
                          {flashcard.question}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {flashcard.subject}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              flashcard.difficulty === 'easy'
                                ? 'bg-green-100 text-green-800'
                                : flashcard.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {flashcard.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="mb-6 border border-gray-200 bg-gray-50">
                  <div className="text-center py-4">
                    <p className="text-gray-500">No flashcards due for review</p>
                  </div>
                </Card>
              )}

              {dailyQuestions.length > 0 && (
                <Card className="border border-blue-200 bg-blue-50">
                  <h3 className="font-medium text-blue-800 mb-3">
                    Daily Questions
                  </h3>
                  <div className="space-y-2">
                    {dailyQuestions.map((question, index) => (
                      <div
                        key={index}
                        className="p-3 bg-white rounded-md shadow-sm border border-blue-100"
                      >
                        <p className="font-medium text-gray-800">
                          {question.question}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}