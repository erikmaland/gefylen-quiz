'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { getQuizzes } from '@/lib/api';
import type { Quiz } from '@/types/quiz';
import { formatCreatedAtNorwegian } from '@/lib/dateUtils';

const sortOptions = ['Nyeste', 'Tittel A-Å', 'Tittel Å-A'];

export default function QuizPage() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('Nyeste');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getQuizzes();
        setQuiz(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, []);

  // Filter and sort quiz
  const filteredAndSortedQuiz = quiz
    .filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'Tittel A-Å':
          return a.title.localeCompare(b.title, 'nb');
        case 'Tittel Å-A':
          return b.title.localeCompare(a.title, 'nb');
        case 'Nyeste':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleStartQuiz = (quizId: number) => {
    router.push(`/quiz/${quizId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Laster quizer...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Quiz</h1>
        <p className="mt-2 text-gray-600">Utforsk og ta quiz innen ulike emner</p>
      </div>

      {/* Search and filter */}
      <div className="space-y-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Søk i quizzer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sorter etter</label>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            {sortOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quiz grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedQuiz.map((quiz) => {
          const sortedQuestions = [...quiz.questions].sort((a, b) => a.order - b.order);

          return (
            <button
              key={quiz.id}
              onClick={() => handleStartQuiz(quiz.id)}
              className="flex flex-col text-left rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{quiz.title}</h2>
                <p className="mt-2 text-gray-600 line-clamp-2">{quiz.description}</p>
              </div>
              
              <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>{sortedQuestions.length} spørsmål</span>
                </div>
                <div className="text-xs text-gray-400">
                  Opprettet {formatCreatedAtNorwegian(quiz.createdAt)}
                </div>
              </div>

              <div className="mt-4 w-full rounded-md bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-600">
                Klikk for å starte quiz
              </div>
            </button>
          );
        })}
      </div>

      {/* No results message */}
      {filteredAndSortedQuiz.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Ingen quiz funnet som matcher søkekriteriene dine.</p>
        </div>
      )}
    </div>
  );
} 