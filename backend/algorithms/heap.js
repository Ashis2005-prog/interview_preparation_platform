/**
 * Min-Heap (Priority Queue) — O(log n) push/pop
 * Used for: problem recommendations ranked by priority score
 *           (frequency, difficulty weight, user history)
 */
class MinHeap {
  constructor() {
    this.heap = [];  // array of { item, priority }
  }

  get size() { return this.heap.length; }

  /** Insert item with given priority (lower = higher priority) */
  push(item, priority) {
    this.heap.push({ item, priority });
    this._bubbleUp(this.heap.length - 1);
  }

  /** Remove and return the minimum-priority item */
  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    const top  = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._sinkDown(0);
    return top;
  }

  /** Peek without removing */
  peek() {
    return this.heap[0] || null;
  }

  /** Get top-k items without modifying the heap */
  getTopK(k) {
    const snapshot = new MinHeap();
    snapshot.heap = [...this.heap];
    const results = [];
    for (let i = 0; i < k && snapshot.size > 0; i++) {
      results.push(snapshot.pop().item);
    }
    return results;
  }

  /** Build heap from array in O(n) */
  static buildFrom(arr) {
    const h = new MinHeap();
    h.heap = arr.map(({ item, priority }) => ({ item, priority }));
    for (let i = Math.floor(h.size / 2) - 1; i >= 0; i--) h._sinkDown(i);
    return h;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].priority <= this.heap[i].priority) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  _sinkDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && this.heap[l].priority < this.heap[smallest].priority) smallest = l;
      if (r < n && this.heap[r].priority < this.heap[smallest].priority) smallest = r;
      if (smallest === i) break;
      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}

/**
 * Max-Heap — wraps MinHeap by negating priority
 */
class MaxHeap {
  constructor() { this._h = new MinHeap(); }
  push(item, priority) { this._h.push(item, -priority); }
  pop() { const r = this._h.pop(); return r ? { ...r, priority: -r.priority } : null; }
  peek() { const r = this._h.peek(); return r ? { ...r, priority: -r.priority } : null; }
  getTopK(k) { return this._h.getTopK(k); }
  get size() { return this._h.size; }
}

module.exports = { MinHeap, MaxHeap };
