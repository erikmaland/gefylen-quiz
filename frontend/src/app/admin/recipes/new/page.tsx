"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRecipe } from "@/lib/api";

export default function NewRecipePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleIngredientChange = (idx: number, value: string) => {
    setIngredients((prev) => prev.map((ing, i) => (i === idx ? value : ing)));
  };
  const handleStepChange = (idx: number, value: string) => {
    setSteps((prev) => prev.map((step, i) => (i === idx ? value : step)));
  };

  const addIngredient = () => setIngredients((prev) => [...prev, ""]);
  const removeIngredient = (idx: number) => setIngredients((prev) => prev.filter((_, i) => i !== idx));
  const addStep = () => setSteps((prev) => [...prev, ""]);
  const removeStep = (idx: number) => setSteps((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createRecipe({
        name,
        description,
        preparationTime,
        ingredients: ingredients.filter((i) => i.trim() !== ""),
        steps: steps.filter((s) => s.trim() !== ""),
      });
      setSuccess(true);
      setName("");
      setDescription("");
      setPreparationTime("");
      setIngredients([""]);
      setSteps([""]);
      // Optionally redirect or show a message
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Opprett Ny Oppskrift</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block font-medium mb-1">Navn</label>
          <input type="text" className="w-full border rounded p-2" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Beskrivelse</label>
          <textarea className="w-full border rounded p-2" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Tilberedningstid</label>
          <input type="text" className="w-full border rounded p-2" value={preparationTime} onChange={e => setPreparationTime(e.target.value)} required />
        </div>
        <div>
          <label className="block font-medium mb-1">Ingredienser</label>
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input type="text" className="flex-1 border rounded p-2" value={ing} onChange={e => handleIngredientChange(idx, e.target.value)} required />
              {ingredients.length > 1 && (
                <button type="button" onClick={() => removeIngredient(idx)} className="text-red-500">Fjern</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addIngredient} className="text-indigo-600 mt-1">+ Legg til ingrediens</button>
        </div>
        <div>
          <label className="block font-medium mb-1">Steg</label>
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-2 mb-2 items-center">
              <span className="text-gray-500 w-6">{idx + 1}.</span>
              <input type="text" className="flex-1 border rounded p-2" value={step} onChange={e => handleStepChange(idx, e.target.value)} required />
              {steps.length > 1 && (
                <button type="button" onClick={() => removeStep(idx)} className="text-red-500">Fjern</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addStep} className="text-indigo-600 mt-1">+ Legg til steg</button>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">Oppskriften ble lagret!</div>}
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded font-medium" disabled={loading}>
          {loading ? "Lagrer..." : "Lagre Oppskrift"}
        </button>
      </form>
    </div>
  );
} 