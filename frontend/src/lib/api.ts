import type { Quiz, QuizForm } from '@/types/quiz';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function createQuiz(data: QuizForm): Promise<Quiz> {
  const response = await fetch(`${API_URL}/quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create quiz');
  }

  return response.json();
}

export async function getQuizzes(): Promise<Quiz[]> {
  const response = await fetch(`${API_URL}/quiz`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch quizzes');
  }

  return response.json();
}

export async function getQuiz(id: string): Promise<Quiz> {
  const response = await fetch(`${API_URL}/quiz/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch quiz');
  }

  return response.json();
}

export async function getQuizById(id: string) {
  const response = await fetch(`${API_URL}/quiz/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch quiz');
  }

  return response.json();
}

export async function updateQuiz(id: string, quiz: QuizForm): Promise<Quiz> {
  const response = await fetch(`${API_URL}/quiz/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quiz),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update quiz');
  }

  return response.json();
}

export async function deleteQuiz(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/quiz/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete quiz');
  }
} 