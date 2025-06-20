'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getQuiz, updateQuiz } from '@/lib/api';
import type { Quiz, QuizForm, Question } from '@/types/quiz';

export default function EditQuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<QuizForm>({
    title: '',
    description: '',
    questions: []
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getQuiz(params.id);
        setQuiz(data);
        setFormData({
          title: data.title,
          description: data.description,
          questions: data.questions.map((q: Question) => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer
          }))
        });
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [isAuthenticated, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await updateQuiz(params.id, formData);
      router.push('/admin/quiz');
    } catch (err) {
      console.error('Error updating quiz:', err);
      setError(err instanceof Error ? err.message : 'Failed to update quiz');
    }
  };

  const handleQuestionChange = (index: number, field: string, value: string | string[] | number) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData({ ...formData, questions: newQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { text: '', options: [''], correctAnswer: 0 }
      ]
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options.push('');
    setFormData({ ...formData, questions: newQuestions });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setFormData({ ...formData, questions: newQuestions });
  };

  if (!isAuthenticated) {
    return <div className="text-center py-12 text-gray-500">Du må være logget inn for å se denne siden.</div>;
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Laster quiz...</div>;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          <p className="font-medium">Feil</p>
          <p>{error}</p>
          <button
            onClick={() => router.push('/admin/quiz')}
            className="mt-4 text-red-600 hover:text-red-800"
          >
            ← Tilbake til Quiz Liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Rediger Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tittel</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Beskrivelse</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Spørsmål</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700"
            >
              + Legg til Spørsmål
            </button>
          </div>

          {formData.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700">Spørsmål {questionIndex + 1}</label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(questionIndex)}
                  className="ml-4 text-red-600 hover:text-red-800"
                >
                  Fjern
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Alternativer</label>
                  <button
                    type="button"
                    onClick={() => addOption(questionIndex)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    + Legg til Alternativ
                  </button>
                </div>

                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`correct-${questionIndex}`}
                      checked={question.correctAnswer === optionIndex}
                      onChange={() => handleQuestionChange(questionIndex, 'correctAnswer', optionIndex)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options];
                        newOptions[optionIndex] = e.target.value;
                        handleQuestionChange(questionIndex, 'options', newOptions);
                      }}
                      className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(questionIndex, optionIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Fjern
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/quiz')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Lagre Endringer
          </button>
        </div>
      </form>
    </div>
  );
} 