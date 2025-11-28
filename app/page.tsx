"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { SuggestList } from "../components/SuggestList";

export default function Home() {
  const [word, setWord] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const fetchSuggest = async (text: string) => {
    if (!text) return setResults([]);
    setLoading(true);
    try {
      const res = await fetch(`/api/suggest?word=${encodeURIComponent(text)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWord(value);
    if (timer) clearTimeout(timer);
    const t = setTimeout(() => fetchSuggest(value), 300);
    setTimer(t);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">English Word Suggest</h1>
        <ThemeToggle />
      </div>

      <input
        value={word}
        onChange={handleChange}
        placeholder="Type a word..."
        className="w-full max-w-md p-2 rounded border border-gray-400 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-black dark:text-white transition-all"
      />

      {loading && <p className="mt-2 text-gray-500">Loading...</p>}

      {!loading && results.length > 0 && (
        <SuggestList results={results} onSelect={setWord} />
      )}

      {!loading && results.length === 0 && word && (
        <p className="mt-2 text-gray-500">No results</p>
      )}
    </div>
  );
}
