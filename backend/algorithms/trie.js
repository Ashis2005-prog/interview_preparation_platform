/**
 * Trie (Prefix Tree) — O(m) insert/search where m = word length
 * Used for: real-time autocomplete search on problems, tags, categories
 */
class TrieNode {
  constructor() {
    this.children = {};   // char -> TrieNode
    this.isEnd   = false;
    this.items   = [];    // items stored at this end node
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  /** Insert a word with its associated data item */
  insert(word, item) {
    let node = this.root;
    for (const ch of word.toLowerCase().trim()) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
    // Avoid duplicates (same item/id)
    const id = item._id ? item._id.toString() : item.id;
    if (!node.items.find(i => (i._id || i.id)?.toString() === id)) {
      node.items.push(item);
    }
  }

  /** Search all items matching a prefix — returns up to `limit` results */
  search(prefix, limit = 10) {
    let node = this.root;
    for (const ch of prefix.toLowerCase().trim()) {
      if (!node.children[ch]) return [];
      node = node.children[ch];
    }
    const results = [];
    this._dfs(node, results, limit);
    return results;
  }

  /** DFS collect all end-node items below a node */
  _dfs(node, results, limit) {
    if (results.length >= limit) return;
    if (node.isEnd) {
      for (const item of node.items) {
        if (results.length >= limit) break;
        results.push(item);
      }
    }
    for (const child of Object.values(node.children)) {
      if (results.length >= limit) break;
      this._dfs(child, results, limit);
    }
  }

  /** Check exact existence */
  has(word) {
    let node = this.root;
    for (const ch of word.toLowerCase()) {
      if (!node.children[ch]) return false;
      node = node.children[ch];
    }
    return node.isEnd;
  }

  /** Delete a word (optional cleanup) */
  delete(word) {
    this._deleteHelper(this.root, word.toLowerCase(), 0);
  }

  _deleteHelper(node, word, depth) {
    if (!node) return false;
    if (depth === word.length) {
      if (node.isEnd) { node.isEnd = false; node.items = []; }
      return Object.keys(node.children).length === 0;
    }
    const ch = word[depth];
    if (this._deleteHelper(node.children[ch], word, depth + 1)) {
      delete node.children[ch];
      return !node.isEnd && Object.keys(node.children).length === 0;
    }
    return false;
  }
}

module.exports = Trie;
