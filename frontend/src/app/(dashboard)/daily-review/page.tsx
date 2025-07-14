'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { FiArrowLeft, FiArrowRight, FiCheck, FiX, FiClock, FiHelpCircle } from 'react-icons/fi';
import useFlashcardStore from '@/app/hooks/useFlashcardStore';
import useAIStore from '@/app/hooks/useAIStore';
import Button from '@/app/components/ui/Button';
import Card from '@/app/components/ui/Card';
import { Flashcard, DailyQuestion } from '@/app/types';

export default function DailyReviewPage() {
  const { dailyFlashcards, fetchDailyFlashcards, reviewFlashcard } = useFlashcardStore();
  const { dailyQuestions, generateDailyQuestions } = useAIStore();
  
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<'flashcards' | 'questions'>('flashcards');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  });

  useEffect(() => {
    const loadDailyReview = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchDailyFlashcards(),
          generateDailyQuestions()
        ]);
      } catch (error) {
        console.error('Error loading daily review:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDailyReview();
  }, [fetchDailyFlashcards, generateDailyQuestions]);

  useEffect(() => {
    if (!loading) {
      setStats({
        total: dailyFlashcards.length + dailyQuestions.length,
        completed: 0,
        easy: 0,
        medium: 0,
        hard: 0,
      });
    }
  }, [loading, dailyFlashcards, dailyQuestions]);

  const getCurrentItem = () => {
    if (currentSection === 'flashcards') {
      return dailyFlashcards[currentIndex];
    } else {
      return dailyQuestions[currentIndex];
    }
  };

  const handleNext = () => {
    if (currentSection === 'flashcards') {
      if (currentIndex < dailyFlashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Move to questions section
        setCurrentSection('questions');
        setCurrentIndex(0);
        setShowAnswer(false);
      }
    } else {
      if (currentIndex < dailyQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Completed review
        setCompleted(true);
      }
    }

    setStats(prev => ({
      ...prev,
      completed: prev.completed + 1
    }));
  };

  const handlePrevious = () => {
    if (currentSection === 'flashcards') {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setShowAnswer(false);
      }
    } else {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setShowAnswer(false);
      } else if (dailyFlashcards.length > 0) {
        // Move back to flashcards section
        setCurrentSection('flashcards');
        setCurrentIndex(dailyFlashcards.length - 1);
        setShowAnswer(false);
      }
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleReview = async (difficulty: string) => {
    if (currentSection === 'flashcards') {
      try {
        await reviewFlashcard(dailyFlashcards[currentIndex]._id, difficulty);
        
        setStats(prev => ({
          ...prev,
          [difficulty]: prev[difficulty as keyof typeof prev] + 1
        }));
        
        handleNext();
      } catch (error) {
        console.error('Error reviewing flashcard:', error);
      }
    } else {
      // For questions, just track the difficulty
      setStats(prev => ({
        ...prev,
        [difficulty]: prev[difficulty as keyof typeof prev] + 1
      }));
      
      handleNext();
    }
  };

  const resetReview = () => {
    setCurrentSection('flashcards');
    setCurrentIndex(0);
    setShowAnswer(false);
    setCompleted(false);
    setStats({
      total: dailyFlashcards.length + dailyQuestions.length,
      completed: 0,
      easy: 0,
      medium: 0,
      hard: 0,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (dailyFlashcards.length === 0 && dailyQuestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <FiClock className="text-indigo-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No review items for today</h2>
          <p className="text-gray-600 mb-6">
            You don't have any flashcards due for review today. Come back tomorrow or create more flashcards.
          </p>
          <Button onClick={() => window.location.href = '/flashcards'}>
            Go to Flashcards
          </Button>
        </Card>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <FiCheck className="text-green-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Review Completed!</h2>
          <p className="text-gray-600 mb-8">
            Great job! You've completed your daily review session.
          </p>
          
          <div className="max-w-xs mx-auto mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Your Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed:</span>
                  <span className="font-medium">{stats.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Easy:</span>
                  <span className="font-medium">{stats.easy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">Medium:</span>
                  <span className="font-medium">{stats.medium}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">Hard:</span>
                  <span className="font-medium">{stats.hard}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={resetReview} variant="outline">
              Restart Review
            </Button>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentItem = getCurrentItem();
  const progress = Math.round(
    (stats.completed / stats.total) * 100
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Daily Review</h1>
        <p className="text-gray-600">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentSection}-${currentIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="mb-6 min-h-[300px] flex flex-col">
            <div className="border-b border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  {currentSection === 'flashcards' ? 'Flashcard' : 'Daily Question'} {currentIndex + 1} of {
                    currentSection === 'flashcards' ? dailyFlashcards.length : dailyQuestions.length
                  }
                </span>
                {currentSection === 'flashcards' && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (currentItem as Flashcard).difficulty === 'easy'
                        ? 'bg-green-100 text-green-800'
                        : (currentItem as Flashcard).difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {(currentItem as Flashcard).difficulty}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                {currentSection === 'flashcards'
                  ? (currentItem as Flashcard).question
                  : (currentItem as DailyQuestion).question}
              </h3>
              
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-gray-50 rounded-lg w-full"
                >
                  <p className="text-gray-800">
                    {currentSection === 'flashcards'
                      ? (currentItem as Flashcard).answer
                      : (currentItem as DailyQuestion).answer}
                  </p>
                </motion.div>
              )}
            </div>

            {currentSection === 'flashcards' && (
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {(currentItem as Flashcard).subject}
                  </span>
                </div>
              </div>
            )}
          </Card>

          {!showAnswer ? (
            <div className="flex justify-center mb-6">
              <Button onClick={toggleAnswer}>Show Answer</Button>
            </div>
          ) : (
            <div className="space-y-6">
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
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              size="sm"
              icon={<FiArrowLeft />}
              onClick={handlePrevious}
              disabled={currentSection === 'flashcards' && currentIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!showAnswer}
            >
              Skip
              <FiArrowRight className="ml-2" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}