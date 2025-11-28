import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

let words: string[] = [];
let index: Record<string, string[]> = {};

function loadWords() {
  if (words.length) return;

  const filePath = path.join(process.cwd(), "public", "words_alpha.txt");
  const txt = fs.readFileSync(filePath, "utf8");
  words = txt.split("\n");

  for (const w of words) {
    const f = w[0]?.toLowerCase();
    if (!f) continue;
    if (!index[f]) index[f] = [];
    index[f].push(w);
  }
}

function shuffle(arr: string[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function GET(req: NextRequest) {
  const word = req.nextUrl.searchParams.get("word")?.toLowerCase() || "";
  if (!word) return NextResponse.json([]);

  loadWords();

  const group = index[word[0]] || [];
  const matches = group.filter((w) => w.startsWith(word));
  const randomized = shuffle(matches);

  return NextResponse.json(randomized.slice(0, 20));

  // return NextResponse.json([]);
}
