import type { Quiz, QuizForm } from '@/types/quiz';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Quiz API functions
export async function createQuiz(data: QuizForm): Promise<Quiz> {
  console.log('Creating quiz with data:', data);
  console.log('API URL:', `${API_URL}/quiz`);
  
  const response = await fetch(`${API_URL}/quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);

  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error);
    throw new Error(error.error || error.message || 'Failed to create quiz');
  }

  const result = await response.json();
  console.log('Quiz created successfully:', result);
  return result;
}

export async function getQuizzes(): Promise<Quiz[]> {
  console.log('Fetching quizzes list');
  console.log('API URL:', `${API_URL}/quiz`);
  
  const response = await fetch(`${API_URL}/quiz`);
  
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error);
    throw new Error(error.error || error.message || 'Failed to fetch quizzes');
  }

  const result = await response.json();
  console.log('Quizzes fetched successfully:', result);
  return result;
}

export async function getQuiz(id: string): Promise<Quiz> {
  console.log('Fetching quiz with ID:', id);
  console.log('API URL:', `${API_URL}/quiz/${id}`);
  
  const response = await fetch(`${API_URL}/quiz/${id}`);
  
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  
  if (!response.ok) {
    const error = await response.json();
    console.error('API Error:', error);
    throw new Error(error.error || error.message || 'Failed to fetch quiz');
  }

  const result = await response.json();
  console.log('Quiz fetched successfully:', result);
  return result;
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

// Recipe API functions
export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  preparationTime: string;
}

export interface RecipeForm {
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  preparationTime: string;
}

export async function getRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_URL}/recipes`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch recipes');
  }

  return response.json();
}

export async function getRecipe(id: string): Promise<Recipe> {
  const response = await fetch(`${API_URL}/recipes/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch recipe');
  }

  return response.json();
}

export async function createRecipe(data: RecipeForm): Promise<Recipe> {
  const response = await fetch(`${API_URL}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create recipe');
  }

  return response.json();
}

export async function updateRecipe(id: string, data: RecipeForm): Promise<Recipe> {
  const response = await fetch(`${API_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update recipe');
  }

  return response.json();
}

export async function deleteRecipe(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/recipes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete recipe');
  }
} 