'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getQuizzes } from '@/lib/api';
import type { Quiz } from '@/types/quiz';
import { formatCreatedAtNorwegian } from '@/lib/dateUtils';

export default function AdminQuizPage() {
  const { isAuthenticated } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getQuizzes();
        setQuizzes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="text-center py-12 text-gray-500">You must be logged in to view this page.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quizzer</h1>
        <Link href="/admin" className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700">
          + Ny Quiz
        </Link>
      </div>
      {loading && <div className="text-center text-gray-500 py-8">Loading quizzes...</div>}
      {error && <div className="text-center text-red-600 py-8">{error}</div>}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow p-4">
          {quizzes.length === 0 ? (
            <div className="text-gray-400 italic">Ingen quizzer funnet.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-2">Tittel</th>
                  <th className="py-2 px-2">Beskrivelse</th>
                  <th className="py-2 px-2">Spørsmål</th>
                  <th className="py-2 px-2">Opprettet</th>
                  <th className="py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map(quiz => (
                  <tr key={quiz.id} className="border-t">
                    <td className="py-2 px-2 font-medium">{quiz.title}</td>
                    <td className="py-2 px-2">{quiz.description}</td>
                    <td className="py-2 px-2">{quiz.questions.length}</td>
                    <td className="py-2 px-2">{formatCreatedAtNorwegian(quiz.createdAt)}</td>
                    <td className="py-2 px-2">
                      <Link href={`/quiz/${quiz.id}`} className="text-indigo-600 hover:underline mr-4">View</Link>
                      <Link href={`/admin/quiz/${quiz.id}/edit`} className="text-indigo-600 hover:underline">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
} 