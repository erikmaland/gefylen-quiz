"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  preparationTime: string;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`http://localhost:5000/api/recipes`);
        if (!res.ok) throw new Error("Kunne ikke hente oppskrift");
        const data = await res.json();
        const found = data.find((r: any) => r.id === Number(id));
        if (!found) throw new Error("Oppskrift ikke funnet");
        setRecipe(found);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRecipe();
  }, [id]);

  if (loading) return <div className="text-center py-12 text-gray-500">Laster oppskrift...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!recipe) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
      <div className="text-gray-600 mb-4">Tilberedningstid: {recipe.preparationTime}</div>
      <div className="mb-6 text-gray-700 whitespace-pre-line">{recipe.description}</div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ingredienser</h2>
        <ul className="list-disc list-inside text-gray-700">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx}>{ing}</li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Fremgangsmåte</h2>
        <ol className="list-decimal list-inside text-gray-700">
          {recipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
} 