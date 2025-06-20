"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from '@/lib/auth';

interface Recipe {
  id: number;
  name: string;
  description: string;
  preparationTime: string;
}

export default function AdminRecipesPage() {
  const { isAuthenticated } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:5000/api/recipes");
        if (!res.ok) throw new Error("Kunne ikke hente oppskrifter");
        const data = await res.json();
        setRecipes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div className="text-center py-12 text-gray-500">Du må være innlogget for å se denne siden.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Oppskrifter</h1>
        <Link href="/admin/recipes/new" className="bg-indigo-600 text-white px-4 py-2 rounded font-medium hover:bg-indigo-700">
          + Ny Oppskrift
        </Link>
      </div>
      {loading && <div className="text-center text-gray-500 py-8">Laster oppskrifter...</div>}
      {error && <div className="text-center text-red-600 py-8">{error}</div>}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow p-4">
          {recipes.length === 0 ? (
            <div className="text-gray-400 italic">Ingen oppskrifter funnet.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2 px-2">Navn</th>
                  <th className="py-2 px-2">Beskrivelse</th>
                  <th className="py-2 px-2">Tid</th>
                  <th className="py-2 px-2">Rediger</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map(recipe => (
                  <tr key={recipe.id} className="border-t">
                    <td className="py-2 px-2 font-medium">{recipe.name}</td>
                    <td className="py-2 px-2">{recipe.description}</td>
                    <td className="py-2 px-2">{recipe.preparationTime}</td>
                    <td className="py-2 px-2">
                      <Link href={`/admin/recipes/${recipe.id}/edit`} className="text-indigo-600 hover:underline">Rediger</Link>
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