'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { getQuiz } from '@/lib/api';
import type { Quiz } from '@/types/quiz';
import { use } from 'react';

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<number[]>([]);
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getQuiz(parseInt(resolvedParams.id));
        setQuiz(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [resolvedParams.id]);

  const toggleAnswer = (questionId: number) => {
    setRevealedAnswers(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const toggleAllAnswers = () => {
    if (!quiz) return;
    setShowAllAnswers(prev => !prev);
    setRevealedAnswers(prev => 
      prev.length === quiz.questions.length ? [] : quiz.questions.map(q => q.id)
    );
  };

  const isAnswerRevealed = (questionId: number) => {
    return revealedAnswers.includes(questionId) || showAllAnswers;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Laster quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600">{error || 'Quiz ikke funnet'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Gå tilbake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <p className="mt-2 text-gray-600">{quiz.description}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Spørsmål</h2>
        <button
          onClick={toggleAllAnswers}
          className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
        >
          {showAllAnswers ? (
            <>
              <EyeSlashIcon className="h-5 w-5" />
              Skjul alle svar
            </>
          ) : (
            <>
              <EyeIcon className="h-5 w-5" />
              Vis alle svar
            </>
          )}
        </button>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {quiz.questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => toggleAnswer(question.id)}
            className="w-full text-left rounded-lg border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-medium flex items-center gap-2">
                  <span>{index + 1}. {question.text}</span>
                  {isAnswerRevealed(question.id) ? (
                    <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </h3>
                {isAnswerRevealed(question.id) && (
                  <p className="mt-2 text-indigo-600 font-medium animate-fade-in">
                    {question.answer}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 