/**
 * Directed Graph — Adjacency List representation
 * Used for: Learning Roadmap (DAG with topological sort)
 *           Prerequisite chains, shortest learning paths
 */
class Graph {
  constructor() {
    this.adjacencyList = {};  // nodeId -> [neighborId, ...]
    this.nodes         = {};  // nodeId -> metadata
    this.edgeWeights   = {};  // "from->to" -> weight
  }

  /** Add a node with optional metadata */
  addNode(id, data = {}) {
    if (!this.adjacencyList[id]) this.adjacencyList[id] = [];
    this.nodes[id] = data;
    return this;
  }

  /** Add directed edge from → to with optional weight */
  addEdge(from, to, weight = 1) {
    if (!this.adjacencyList[from]) this.addNode(from);
    if (!this.adjacencyList[to])   this.addNode(to);
    if (!this.adjacencyList[from].includes(to)) {
      this.adjacencyList[from].push(to);
    }
    this.edgeWeights[`${from}->${to}`] = weight;
    return this;
  }

  /** BFS — level-order traversal from a start node */
  bfs(startId) {
    if (!this.nodes[startId]) return [];
    const visited = new Set([startId]);
    const queue   = [startId];
    const order   = [];

    while (queue.length) {
      const nodeId = queue.shift();
      order.push({ id: nodeId, data: this.nodes[nodeId] });
      for (const neighbor of (this.adjacencyList[nodeId] || [])) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return order;
  }

  /** DFS — depth-first traversal */
  dfs(startId) {
    const visited = new Set();
    const order   = [];
    const stack   = [startId];

    while (stack.length) {
      const nodeId = stack.pop();
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);
      order.push({ id: nodeId, data: this.nodes[nodeId] });
      for (const neighbor of [...(this.adjacencyList[nodeId] || [])].reverse()) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }
    return order;
  }

  /**
   * Topological Sort (Kahn's Algorithm — BFS-based)
   * Returns nodes in dependency order (prerequisites first)
   * Time: O(V + E)
   */
  topologicalSort() {
    const inDegree = {};
    for (const id of Object.keys(this.nodes)) inDegree[id] = 0;
    for (const [from, neighbors] of Object.entries(this.adjacencyList)) {
      for (const to of neighbors) {
        inDegree[to] = (inDegree[to] || 0) + 1;
      }
    }

    const queue  = Object.keys(inDegree).filter(n => inDegree[n] === 0);
    const result = [];

    while (queue.length) {
      const node = queue.shift();
      result.push({ id: node, data: this.nodes[node] });
      for (const neighbor of (this.adjacencyList[node] || [])) {
        inDegree[neighbor]--;
        if (inDegree[neighbor] === 0) queue.push(neighbor);
      }
    }

    // Check for cycles
    if (result.length !== Object.keys(this.nodes).length) {
      console.warn('Graph has cycles — topological sort may be incomplete');
    }
    return result;
  }

  /**
   * Dijkstra's Shortest Path
   * Returns { distances, previous } from startId to all nodes
   * Time: O((V + E) log V) with priority queue
   */
  dijkstra(startId) {
    const distances = {};
    const previous  = {};
    const visited   = new Set();

    for (const id of Object.keys(this.nodes)) {
      distances[id] = Infinity;
      previous[id]  = null;
    }
    distances[startId] = 0;

    const unvisited = new Set(Object.keys(this.nodes));

    while (unvisited.size) {
      // Get node with minimum distance
      let u = null;
      for (const node of unvisited) {
        if (u === null || distances[node] < distances[u]) u = node;
      }
      if (!u || distances[u] === Infinity) break;
      unvisited.delete(u);

      for (const v of (this.adjacencyList[u] || [])) {
        const w    = this.edgeWeights[`${u}->${v}`] || 1;
        const alt  = distances[u] + w;
        if (alt < distances[v]) {
          distances[v] = alt;
          previous[v]  = u;
        }
      }
    }
    return { distances, previous };
  }

  /** Reconstruct path from Dijkstra's previous map */
  getPath(previous, targetId) {
    const path = [];
    let current = targetId;
    while (current) {
      path.unshift(current);
      current = previous[current];
    }
    return path;
  }

  /** Detect cycle using DFS coloring */
  hasCycle() {
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = {};
    for (const id of Object.keys(this.nodes)) color[id] = WHITE;

    const dfsVisit = (u) => {
      color[u] = GRAY;
      for (const v of (this.adjacencyList[u] || [])) {
        if (color[v] === GRAY) return true;
        if (color[v] === WHITE && dfsVisit(v)) return true;
      }
      color[u] = BLACK;
      return false;
    };

    for (const id of Object.keys(this.nodes)) {
      if (color[id] === WHITE && dfsVisit(id)) return true;
    }
    return false;
  }

  /** Get all prerequisites for a node (ancestors in DAG) */
  getPrerequisites(nodeId) {
    const prereqs = new Set();
    const reverseAdj = {};
    for (const [from, neighbors] of Object.entries(this.adjacencyList)) {
      for (const to of neighbors) {
        if (!reverseAdj[to]) reverseAdj[to] = [];
        reverseAdj[to].push(from);
      }
    }
    const queue = [nodeId];
    while (queue.length) {
      const n = queue.shift();
      for (const prereq of (reverseAdj[n] || [])) {
        if (!prereqs.has(prereq)) { prereqs.add(prereq); queue.push(prereq); }
      }
    }
    return [...prereqs];
  }

  /** Serialize for JSON response */
  toJSON() {
    return {
      nodes: Object.entries(this.nodes).map(([id, data]) => ({ id, ...data })),
      edges: Object.entries(this.adjacencyList).flatMap(([from, neighbors]) =>
        neighbors.map(to => ({ from, to, weight: this.edgeWeights[`${from}->${to}`] || 1 }))
      )
    };
  }
}

module.exports = Graph;
