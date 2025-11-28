"use client";

type SuggestListProps = {
  results: string[];
  onSelect: (word: string) => void;
};

export function SuggestList({ results, onSelect }: SuggestListProps) {
  return (
    <div
      className="max-h-60 w-md overflow-y-auto rounded mt-2 border border-gray-300 dark:border-gray-700
      bg-gray-100 dark:bg-gray-900
      transition-colors"
    >
      {results.map((word, idx) => (
        <div
          key={idx}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer
            transition-colors"
          onClick={() => onSelect(word)}
        >
          {word}
        </div>
      ))}
    </div>
  );
}
