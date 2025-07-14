'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter, FiRefreshCw, FiCheck, FiX, FiBook } from 'react-icons/fi';
import useFlashcardStore from '@/app/hooks/useFlashcardStore';
import useNoteStore from '@/app/hooks/useNoteStore';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import Input from '@/app/components/ui/Input';
import { Flashcard } from '@/app/types';

export default function FlashcardsPage() {
  const { flashcards, fetchFlashcards, reviewFlashcard } = useFlashcardStore();
  const { subjects, fetchSubjects } = useNoteStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [dueOnly, setDueOnly] = useState(false);
  const [filteredFlashcards, setFilteredFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState(false);

  useEffect(() => {
    const loadFlashcards = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchFlashcards(selectedSubject, selectedDifficulty, searchTerm, dueOnly),
          fetchSubjects()
        ]);
      } catch (error) {
        console.error('Error loading flashcards:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFlashcards();
  }, [fetchFlashcards, fetchSubjects, selectedSubject, selectedDifficulty, searchTerm, dueOnly]);

  useEffect(() => {
    setFilteredFlashcards(flashcards);
  }, [flashcards]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(e.target.value);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDifficulty(e.target.value);
  };

  const toggleDueOnly = () => {
    setDueOnly(!dueOnly);
  };

  const startStudyMode = () => {
    if (filteredFlashcards.length > 0) {
      setCurrentIndex(0);
      setShowAnswer(false);
      setStudyMode(true);
    }
  };

  const exitStudyMode = () => {
    setStudyMode(false);
  };

  const nextCard = () => {
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      // End of deck
      exitStudyMode();
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleReview = async (difficulty: string) => {
    if (filteredFlashcards[currentIndex]) {
      try {
        await reviewFlashcard(filteredFlashcards[currentIndex]._id, difficulty);
        nextCard();
      } catch (error) {
        console.error('Error reviewing flashcard:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {studyMode ? (
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Study Mode</h1>
            <Button variant="outline" size="sm" icon={<FiX />} onClick={exitStudyMode}>
              Exit
            </Button>
          </div>

          {filteredFlashcards.length > 0 && (
            <>
              <div className="mb-4 text-center">
                <span className="text-sm text-gray-500">
                  Card {currentIndex + 1} of {filteredFlashcards.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="mb-6 min-h-[300px] flex flex-col">
                    <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">
                        {filteredFlashcards[currentIndex].question}
                      </h3>
                      
                      {showAnswer && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-6 p-4 bg-gray-50 rounded-lg w-full"
                        >
                          <p className="text-gray-800">
                            {filteredFlashcards[currentIndex].answer}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {filteredFlashcards[currentIndex].subject}
                          </span>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              filteredFlashcards[currentIndex].difficulty === 'easy'
                                ? 'bg-green-100 text-green-800'
                                : filteredFlashcards[currentIndex].difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {filteredFlashcards[currentIndex].difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {!showAnswer ? (
                    <div className="flex justify-center">
                      <Button onClick={toggleAnswer}>Show Answer</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-center space-x-4">
                        <Button
                          variant="danger"
                          onClick={() => handleReview('hard')}
                        >
                          Hard
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleReview('medium')}
                        >
                          Medium
                        </Button>
                        <Button
                          variant="success"
                          onClick={() => handleReview('easy')}
                        >
                          Easy
                        </Button>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={prevCard}
                          disabled={currentIndex === 0}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={nextCard}
                        >
                          {currentIndex === filteredFlashcards.length - 1 ? 'Finish' : 'Skip'}
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Flashcards</h1>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                icon={<FiRefreshCw />}
                onClick={startStudyMode}
                disabled={filteredFlashcards.length === 0}
              >
                Study Mode
              </Button>
              <Link href="/flashcards/new">
                <Button icon={<FiPlus />}>Add Flashcard</Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search flashcards..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10"
                    fullWidth
                  />
                </div>
              </div>
              
              <div>
                <select
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={selectedDifficulty}
                  onChange={handleDifficultyChange}
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <input
                id="due-only"
                type="checkbox"
                checked={dueOnly}
                onChange={toggleDueOnly}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="due-only" className="ml-2 block text-sm text-gray-900">
                Show only cards due for review
              </label>
            </div>
          </div>

          {/* Flashcards Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : filteredFlashcards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFlashcards.map((flashcard) => (
                <Card
                  key={flashcard._id}
                  hoverable
                  className="border border-gray-200 hover:border-indigo-200 transition-all"
                >
                  <div className="p-4">
                    <h3 className="font-medium text-lg text-gray-900 mb-2">
                      {flashcard.question}
                    </h3>
                    <div className="bg-gray-50 p-3 rounded-md mb-3">
                      <p className="text-gray-700">{flashcard.answer}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {flashcard.subject}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                </Card>
              ))}
              
              <Link href="/flashcards/new">
                <Card
                  hoverable
                  className="h-full border border-dashed border-gray-300 hover:border-indigo-300 transition-all"
                >
                  <div className="flex flex-col items-center justify-center h-full py-12">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                      <FiPlus className="text-indigo-600" size={24} />
                    </div>
                    <p className="text-indigo-600 font-medium">Add New Flashcard</p>
                  </div>
                </Card>
              </Link>
            </div>
          ) : (
            <Card className="border border-gray-200 bg-gray-50">
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                  
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No flashcards found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || selectedSubject || selectedDifficulty || dueOnly
                    ? "No flashcards match your search criteria"
                    : "You don't have any flashcards yet"}
                </p>
                <Link href="/flashcards/new">
                  <Button icon={<FiPlus />}>Create Your First Flashcard</Button>
                </Link>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}