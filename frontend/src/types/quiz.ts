export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizQuestion {
  id: number;
  quizId: number;
  questionId: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  question: Question;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizForm {
  title: string;
  description: string;
  questions: {
    text: string;
    options: string[];
    correctAnswer: number;
  }[];
} 