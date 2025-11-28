import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
// import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

export default function App() {
  const [word, setWord] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  let debounceTimer: any;

  const fetchSuggest = async (text: string) => {
    if (!text) return setResults([]);

    try {
      setLoading(true);
      const res = await fetch(`/api/suggest?word=${encodeURIComponent(text)}`);
      const data = await res.json();
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWord(value);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fetchSuggest(value), 300);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 flex flex-col items-center">
      {/* Toggle Theme */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-4 mt-12">
        <h1 className="text-3xl font-bold text-center">Word Suggest</h1>

        <Input
          value={word}
          onChange={handleChange}
          placeholder="Type a word..."
        />

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-2 p-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-64 overflow-auto divide-y">
                {results.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setWord(item)}
                    className="p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              word && (
                <p className="p-4 text-sm text-muted-foreground">
                  No results found.
                </p>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
