import express from 'express';
import cors from 'cors';
import prisma from './lib/prisma';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

interface QuestionInput {
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizInput {
  title: string;
  description: string;
  questions: QuestionInput[];
}

interface RecipeInput {
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  preparationTime: string;
}

// Quiz endpoints
app.post('/api/quiz', async (req, res) => {
  try {
    const { title, description, questions } = req.body as QuizInput;

    // Validate input
    if (!title || !description || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate each question
    for (const question of questions) {
      if (!question.text || !Array.isArray(question.options) || question.options.length === 0) {
        return res.status(400).json({ error: 'Invalid question format' });
      }
    }

    // Create quiz
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        questions: {
          create: questions.map((q, index) => ({
            text: q.text,
            options: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            order: index
          }))
        }
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    // Parse options back to arrays
    const parsedQuiz = {
      ...quiz,
      questions: quiz.questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      }))
    };

    return res.json(parsedQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    return res.status(500).json({ error: 'Failed to create quiz' });
  }
});

app.get('/api/quiz', async (_req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    // Parse options back to arrays
    const parsedQuizzes = quizzes.map(quiz => ({
      ...quiz,
      questions: quiz.questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      }))
    }));

    return res.json(parsedQuizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

app.get('/api/quiz/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Parse options back to arrays
    const parsedQuiz = {
      ...quiz,
      questions: quiz.questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      }))
    };

    return res.json(parsedQuiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

app.put('/api/quiz/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, questions } = req.body as QuizInput;

    // Validate input
    if (!title || !description || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate each question
    for (const question of questions) {
      if (!question.text || !Array.isArray(question.options) || question.options.length === 0) {
        return res.status(400).json({ error: 'Invalid question format' });
      }
    }

    // Update quiz
    const updatedQuiz = await prisma.quiz.update({
      where: { id },
      data: {
        title,
        description,
        questions: {
          deleteMany: {},
          create: questions.map((q, index) => ({
            text: q.text,
            options: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            order: index
          }))
        }
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    // Parse options back to arrays
    const parsedQuiz = {
      ...updatedQuiz,
      questions: updatedQuiz.questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      }))
    };

    return res.json(parsedQuiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    return res.status(500).json({ error: 'Failed to update quiz' });
  }
});

app.delete('/api/quiz/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.quiz.delete({
      where: { id }
    });
    return res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return res.status(500).json({ error: 'Failed to delete quiz' });
  }
});

// Recipe endpoints
app.get('/api/recipes', async (_req, res) => {
  try {
    const recipes = await prisma.recipe.findMany();
    // Parse JSON strings back to arrays
    const parsedRecipes = recipes.map(recipe => ({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      steps: JSON.parse(recipe.steps)
    }));
    return res.json(parsedRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await prisma.recipe.findUnique({
      where: { id }
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Parse JSON strings back to arrays
    const parsedRecipe = {
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      steps: JSON.parse(recipe.steps)
    };

    return res.json(parsedRecipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

app.post('/api/recipes', async (req, res) => {
  try {
    const { name, description, ingredients, steps, preparationTime } = req.body as RecipeInput;

    // Validate input
    if (!name || !description || !Array.isArray(ingredients) || !Array.isArray(steps) || !preparationTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create recipe
    const recipe = await prisma.recipe.create({
      data: {
        name,
        description,
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps),
        preparationTime
      }
    });

    // Return parsed recipe
    return res.json({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      steps: JSON.parse(recipe.steps)
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return res.status(500).json({ error: 'Failed to create recipe' });
  }
});

app.put('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, ingredients, steps, preparationTime } = req.body as RecipeInput;

    // Validate input
    if (!name || !description || !Array.isArray(ingredients) || !Array.isArray(steps) || !preparationTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Update recipe
    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        name,
        description,
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps),
        preparationTime
      }
    });

    // Return parsed recipe
    return res.json({
      ...recipe,
      ingredients: JSON.parse(recipe.ingredients),
      steps: JSON.parse(recipe.steps)
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    return res.status(500).json({ error: 'Failed to update recipe' });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.recipe.delete({
      where: { id }
    });
    return res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 