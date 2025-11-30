import fs from "fs";
import path from "path";
import { ByteRadixTrie } from "./ByteRadixTrie";

let trie: ByteRadixTrie | null = null;

export function loadTrie() {
  if (trie) return trie;

  const filePath = path.join(process.cwd(), "public", "words_alpha.txt");
  const txt = fs.readFileSync(filePath, "utf8");

  const list = txt
    .split("\n")
    .map((w) => w.trim())
    .filter(Boolean);

  const t = new ByteRadixTrie();
  for (const w of list) t.insert(w);

  trie = t;
  return trie;
}
