'use client';

import { useState } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createQuiz } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';

interface Question {
  id: string;
  question: string;
  answer: string;
}

interface QuizForm {
  title: string;
  description: string;
  questions: Question[];
}

interface FormErrors {
  title?: string;
  description?: string;
  questions?: string;
  newQuestion?: {
    question?: string;
    answer?: string;
  };
  submit?: string;
}

const initialQuizState: QuizForm = {
  title: '',
  description: '',
  questions: [],
};

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, login, logout } = useAuth();
  const [quizForm, setQuizForm] = useState<QuizForm>(initialQuizState);
  const [newQuestion, setNewQuestion] = useState({ question: '', answer: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const success = await login(password);
      if (!success) {
        setLoginError('Ugyldig passord');
      }
    } catch (err) {
      setLoginError('En feil oppstod');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Tittel er påkrevd';
        if (value.length < 3) return 'Tittel må være minst 3 tegn';
        return undefined;
      case 'description':
        if (!value.trim()) return 'Beskrivelse er påkrevd';
        if (value.length < 10) return 'Beskrivelse må være minst 10 tegn';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleQuizChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    setQuizForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateNewQuestion = () => {
    const questionErrors: FormErrors['newQuestion'] = {};
    
    if (!newQuestion.question.trim()) {
      questionErrors.question = 'Question is required';
    }
    if (!newQuestion.answer.trim()) {
      questionErrors.answer = 'Answer is required';
    }

    setErrors(prev => ({
      ...prev,
      newQuestion: questionErrors
    }));

    return Object.keys(questionErrors).length === 0;
  };

  const handleAddQuestion = () => {
    if (validateNewQuestion()) {
      setQuizForm(prev => ({
        ...prev,
        questions: [
          ...prev.questions,
          { ...newQuestion, id: crypto.randomUUID() },
        ],
      }));
      setNewQuestion({ question: '', answer: '' });
      setErrors(prev => ({ ...prev, newQuestion: undefined }));
    }
  };

  const handleRemoveQuestion = (id: string) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate all fields
    Object.keys(quizForm).forEach(key => {
      if (key !== 'questions') {
        const error = validateField(key, quizForm[key as keyof QuizForm]);
        if (error) newErrors[key as keyof FormErrors] = error;
      }
    });

    // Validate questions
    if (quizForm.questions.length === 0) {
      newErrors.questions = 'At least one question is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createQuiz({
        title: quizForm.title,
        description: quizForm.description,
        questions: quizForm.questions.map(q => ({
          text: q.question,
          options: [q.answer],
          correctAnswer: 0,
        })),
      });

      router.push('/quiz');
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err instanceof Error ? err.message : 'Kunne ikke opprette quiz',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFieldError = (fieldName: string) => {
    const error = errors[fieldName as keyof FormErrors];
    if (!touched[fieldName] || !error || typeof error !== 'string') return null;
    return <p className="mt-1 text-sm text-red-600">{error}</p>;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="w-full max-w-md space-y-8 p-6">
          <div>
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              Admin Innlogging
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">
                Passord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Admin passord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {loginError && (
              <div className="text-red-600 text-sm text-center">{loginError}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {isLoggingIn ? 'Logger inn...' : 'Logg inn'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashbord</h1>
          <p className="mt-2 text-gray-600">Opprett og administrer quiz</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Details Section */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-xl font-semibold mb-4">Quiz Detaljer</h2>
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tittel</label>
              <input
                type="text"
                name="title"
                value={quizForm.title}
                onChange={handleQuizChange}
                onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
                required
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  touched.title && errors.title ? 'border-red-500' : ''
                }`}
              />
              {renderFieldError('title')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Beskrivelse</label>
              <textarea
                name="description"
                value={quizForm.description}
                onChange={handleQuizChange}
                onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
                required
                rows={3}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  touched.description && errors.description ? 'border-red-500' : ''
                }`}
              />
              {renderFieldError('description')}
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-xl font-semibold mb-4">Spørsmål</h2>
          <div className="space-y-6">
            {quizForm.questions.map((q, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Spørsmål {index + 1}</label>
                    <input
                      type="text"
                      name={`questions.${index}.question`}
                      value={q.question}
                      onChange={handleQuizChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Svar</label>
                    <input
                      type="text"
                      name={`questions.${index}.answer`}
                      value={q.answer}
                      onChange={handleQuizChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(q.id)}
                  className="mt-6 text-red-600 hover:text-red-800"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddQuestion}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
            >
              <PlusIcon className="h-5 w-5" />
              Legg til spørsmål
            </button>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {errors.submit && (
            <p className="text-sm text-red-600">{errors.submit}</p>
          )}
          {Object.keys(errors).length > 0 && touched.submit && !errors.submit && (
            <p className="text-sm text-red-600">Vennligst fiks alle feil før innsending</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || quizForm.questions.length === 0}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Oppretter Quiz...' : 'Opprett Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
} 