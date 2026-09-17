class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    if (typeof word !== "string" || !word.trim()) return;

    let node = this.root;

    for (const char of word.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }

      node = node.children[char];
    }

    node.isEndOfWord = true;
  }

  search(word) {
    if (typeof word !== "string" || !word.trim()) return false;

    let node = this.root;

    for (const char of word.toLowerCase()) {
      if (!node.children[char]) return false;
      node = node.children[char];
    }

    return node.isEndOfWord;
  }

  startsWith(prefix) {
    if (typeof prefix !== "string" || !prefix.trim()) return [];

    let node = this.root;
    const normalizedPrefix = prefix.toLowerCase();

    for (const char of normalizedPrefix) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }

    return this._findWords(node, normalizedPrefix);
  }

  _findWords(node, prefix) {
    const words = [];

    if (node.isEndOfWord) {
      words.push(prefix);
    }

    for (const char in node.children) {
      words.push(...this._findWords(node.children[char], prefix + char));
    }

    return words;
  }
}

module.exports = Trie;
