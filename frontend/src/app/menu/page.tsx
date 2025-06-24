"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecipes, type Recipe } from "@/lib/api";

interface MenuRecipe {
  id: string;
  name: string;
}

export default function MenuPage() {
  const [recipes, setRecipes] = useState<MenuRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRecipes();
        setRecipes(data.map((r: Recipe) => ({ id: r.id, name: r.name })));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleClick = (id: string) => {
    router.push(`/menu/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Vår Meny</h1>
        <p className="text-xl text-gray-600">Oppdag våre omhyggelig tilberedte retter</p>
      </div>

      {loading && <div className="text-center text-gray-500 py-8">Laster oppskrifter...</div>}
      {error && <div className="text-center text-red-600 py-8">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-6 sm:grid-cols-2">
          {recipes.length === 0 ? (
            <div className="text-gray-400 italic col-span-2">Ingen retter funnet.</div>
          ) : (
            recipes.map(recipe => (
              <button
                key={recipe.id}
                onClick={() => handleClick(recipe.id)}
                className="group relative w-full text-left rounded-xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="relative">
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                    {recipe.name}
                  </CardTitle>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                      Se oppskrift
                    </span>
                    <span className="text-gray-400 group-hover:text-indigo-400 transition-colors duration-200">
                      →
                    </span>
                  </div>
                </CardHeader>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
} 