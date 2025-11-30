// import fs from "fs";
// import path from "path";
// import { NextRequest, NextResponse } from "next/server";

// // Node Trie dengan anak fixed 26 (huruf a-z)
// class Node {
//   children: (Node | null)[];
//   isWord: boolean;
//   word: string | null;

//   constructor() {
//     this.children = Array(26).fill(null);
//     this.isWord = false;
//     this.word = null;
//   }
// }

// const root = new Node();
// let loaded = false;
// const prefixCache = new Map<string, string[]>(); // Cache hasil prefix populer

// // convert char → index 0-25
// const idx = (c: string) => c.charCodeAt(0) - 97;

// // insert kata ke trie
// function insert(word: string) {
//   let node = root;
//   for (const ch of word) {
//     const i = idx(ch);
//     if (i < 0 || i > 25) return; // skip kata yang tidak a-z
//     if (node.children[i] === null) node.children[i] = new Node();
//     node = node.children[i]!;
//   }
//   node.isWord = true;
//   node.word = word;
// }

// // Build trie 1×
// function loadTrie() {
//   if (loaded) return;
//   loaded = true;

//   const filePath = path.join(process.cwd(), "public", "words_alpha.txt");
//   const txt = fs.readFileSync(filePath, "utf8");

//   for (const w of txt.split("\n")) {
//     const word = w.trim().toLowerCase();
//     if (word) insert(word);
//   }
// }

// // Cari node prefix
// function findNode(prefix: string): Node | null {
//   let node = root;
//   for (const ch of prefix) {
//     const i = idx(ch);
//     const next = node.children[i];
//     if (next == null) return null;
//     node = next;
//   }
//   return node;
// }

// // DFS optimized — berhenti setelah dapat limit
// function collect(node: Node, out: string[], limit: number) {
//   if (out.length >= limit) return;

//   if (node.isWord && node.word) {
//     out.push(node.word);
//     if (out.length >= limit) return;
//   }

//   // traverse anak dari a → z (super cepat)
//   for (let i = 0; i < 26; i++) {
//     const child = node.children[i];
//     if (child) {
//       collect(child, out, limit);
//       if (out.length >= limit) return;
//     }
//   }
// }

// export async function GET(req: NextRequest) {
//   const word = req.nextUrl.searchParams.get("word")?.toLowerCase() || "";

//   if (!word) return NextResponse.json([]);

//   loadTrie();

//   // Cache prefix populer (cuma prefix ≥ 2 huruf)
//   if (word.length >= 2 && prefixCache.has(word)) {
//     return NextResponse.json(prefixCache.get(word));
//   }

//   const node = findNode(word);
//   if (!node) return NextResponse.json([]);

//   const results: string[] = [];
//   collect(node, results, 20);

//   // Shuffle kecil (fast)
//   for (let i = results.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [results[i], results[j]] = [results[j], results[i]];
//   }

//   const final = results.slice(0, 20);

//   // Simpan ke cache hanya jika prefix ≥2 huruf
//   if (word.length >= 2) prefixCache.set(word, final);

//   return NextResponse.json(final);
// }

// import { NextResponse } from "next/server";
// import { loadTrie } from "@/lib/loadTrie";

// export async function GET(req: Request) {
//   const word = new URL(req.url).searchParams.get("word")?.toLowerCase() ?? "";
//   if (!word) return NextResponse.json([]);

//   const trie = loadTrie();
//   const results = trie.searchPrefix(word, 20);

//   return NextResponse.json(results);
// }

import { NextResponse } from "next/server";
import { loadTrie } from "@/lib/loadTrie";
import { shuffle } from "@/lib/random";

export async function GET(req: Request) {
  const word = new URL(req.url).searchParams.get("word")?.toLowerCase() ?? "";
  if (!word) return NextResponse.json([]);

  const trie = loadTrie();

  // Ambil max 2000 candidate (opsional)
  const allMatches = trie.searchPrefixAll(word, 2000);

  // Randomize result
  const randomized = shuffle(allMatches);

  // Ambil 20
  const out = randomized.slice(0, 20);

  return NextResponse.json(out);
}
