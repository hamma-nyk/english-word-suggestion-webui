export class ByteRadixTrie {
  children: Map<number, ByteRadixTrie>;
  isWord: boolean;

  constructor() {
    this.children = new Map();
    this.isWord = false;
  }

  insert(word: string) {
    let node: ByteRadixTrie = this;
    const bytes = Buffer.from(word, "utf8"); // byte-level insert

    for (const b of bytes) {
      if (!node.children.has(b)) {
        node.children.set(b, new ByteRadixTrie());
      }
      node = node.children.get(b)!;
    }

    node.isWord = true;
  }

  searchPrefix(prefix: string, limit = 20): string[] {
    const result: string[] = [];
    const bytes = Buffer.from(prefix, "utf8");

    // Step 1: navigate to prefix node
    let node: ByteRadixTrie = this;
    for (const b of bytes) {
      const next = node.children.get(b);
      if (!next) return []; // no match
      node = next;
    }

    // Step 2: BFS to collect words
    const queue: { node: ByteRadixTrie; path: number[] }[] = [
      { node, path: [...bytes] },
    ];

    while (queue.length && result.length < limit) {
      const { node, path } = queue.shift()!;

      if (node.isWord) {
        result.push(Buffer.from(path).toString("utf8"));
      }

      for (const [b, child] of node.children) {
        queue.push({ node: child, path: [...path, b] });
      }
    }

    return result;
  }

  searchPrefixAll(prefix: string, max = 2000): string[] {
    const results: string[] = [];
    const bytes = Buffer.from(prefix, "utf8");

    // Step 1: navigate to prefix node
    let node: ByteRadixTrie = this;
    for (const b of bytes) {
      const next = node.children.get(b);
      if (!next) return [];
      node = next;
    }

    // Step 2: BFS collect all matches (limit max)
    const queue: { node: ByteRadixTrie; path: number[] }[] = [
      { node, path: [...bytes] },
    ];

    while (queue.length && results.length < max) {
      const { node, path } = queue.shift()!;

      if (node.isWord) {
        results.push(Buffer.from(path).toString("utf8"));
      }

      for (const [b, child] of node.children) {
        queue.push({ node: child, path: [...path, b] });
      }
    }

    return results;
  }
}
