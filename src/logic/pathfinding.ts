export interface Node {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
  weight: number;
  isObstacle: boolean;
  isBreached?: boolean;
  size: number;
  type: 'empty' | 'building' | 'tree' | 'station' | 'emergency';
}

export type GridMap = Node[][];

export interface SearchStep {
  type: 'frontier' | 'explored' | 'path' | 'heuristics';
  x: number;
  y: number;
  g?: number;
  h?: number;
  f?: number;
  path?: Node[]; // Only for 'path'
  nodesNum?: number;
  queueSz?: number;
}

export interface SearchResult {
  steps: SearchStep[];
  found: boolean;
  path?: Node[];
  breachNodes?: Node[]; // Nodes that need to be breached
}

export type AlgorithmType = 'astar' | 'ucs' | 'greedy' | 'bfs' | 'dfs';

// Manhattan distance
export const getManhattanDistance = (nodeA: { x: number, y: number }, nodeB: { x: number, y: number }) => {
  return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
};

export class PriorityQueue<T> {
  private elements: { priority: number, item: T }[] = [];
  push(item: T, priority: number) {
    this.elements.push({ priority, item });
    this.elements.sort((a, b) => a.priority - b.priority);
  }
  pop(): T | undefined { return this.elements.shift()?.item; }
  isEmpty() { return this.elements.length === 0; }
  get length() { return this.elements.length; }
}

const getNeighbors = (grid: GridMap, node: Node): Node[] => {
  const neighbors: Node[] = [];
  const { x, y } = node;
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
      if (!grid[nx][ny].isObstacle) {
          neighbors.push(grid[nx][ny]);
      }
    }
  }
  return neighbors;
};

const tracePath = (node: Node | null): Node[] => {
    const path: Node[] = [];
    let temp = node;
    while(temp) {
        path.push(temp);
        temp = temp.parent;
    }
    return path.reverse();
};

// ── BFS ──
export const bfs = (grid: GridMap, start: Node, end: Node): SearchResult => {
    const steps: SearchStep[] = [];
    const queue: Node[] = [start];
    const visited = new Set<string>([`${start.x},${start.y}`]);
    let count = 0;

    while (queue.length) {
        const current = queue.shift()!;
        count++;

        if (!(current.x === start.x && current.y === start.y)) {
            steps.push({ type: 'explored', x: current.x, y: current.y, nodesNum: count, queueSz: queue.length });
        }

        if (current.x === end.x && current.y === end.y) {
            const path = tracePath(current);
            return { steps, found: true, path };
        }

        for (const n of getNeighbors(grid, current)) {
            const key = `${n.x},${n.y}`;
            if (!visited.has(key)) {
                visited.add(key);
                n.parent = current;
                steps.push({ type: 'frontier', x: n.x, y: n.y });
                queue.push(n);
            }
        }
    }
    return { steps, found: false };
};

// ── DFS ──
export const dfs = (grid: GridMap, start: Node, end: Node): SearchResult => {
    const steps: SearchStep[] = [];
    const stack: Node[] = [start];
    const visited = new Set<string>([`${start.x},${start.y}`]);
    let count = 0;

    while (stack.length) {
        const current = stack.pop()!;
        count++;

        if (!(current.x === start.x && current.y === start.y)) {
            steps.push({ type: 'explored', x: current.x, y: current.y, nodesNum: count, queueSz: stack.length });
        }

        if (current.x === end.x && current.y === end.y) {
            const path = tracePath(current);
            return { steps, found: true, path };
        }

        for (const n of getNeighbors(grid, current)) {
            const key = `${n.x},${n.y}`;
            if (!visited.has(key)) {
                visited.add(key);
                n.parent = current;
                steps.push({ type: 'frontier', x: n.x, y: n.y });
                stack.push(n);
            }
        }
    }
    return { steps, found: false };
};

// ── Weighted Search Logic (A*, UCS, Greedy) ──
const runWeightedSearch = (
    grid: GridMap,
    start: Node,
    end: Node,
    mode: 'astar' | 'ucs' | 'greedy'
): SearchResult => {
    const steps: SearchStep[] = [];
    const openList = new PriorityQueue<Node>();
    const closedSet = new Set<string>();
    let count = 0;

    // Reset grid-local metrics
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            grid[x][y].g = Infinity;
            grid[x][y].parent = null;
        }
    }

    start.g = 0;
    if (mode === 'astar') {
        start.h = getManhattanDistance(start, end);
        start.f = start.g + start.h * 1.5; // Slight bias for speed like the reference might
    } else if (mode === 'greedy') {
        start.h = getManhattanDistance(start, end);
        start.f = start.h;
    } else { // ucs
        start.f = 0;
    }
    
    openList.push(start, start.f);

    while (!openList.isEmpty()) {
        const current = openList.pop()!;
        const key = `${current.x},${current.y}`;

        if (closedSet.has(key)) continue;
        closedSet.add(key);
        count++;

        if (!(current.x === start.x && current.y === start.y)) {
             steps.push({ type: 'explored', x: current.x, y: current.y, nodesNum: count, queueSz: openList.length });
             steps.push({ type: 'heuristics', x: current.x, y: current.y, g: current.g, h: current.h, f: current.f });
        }

        if (current.x === end.x && current.y === end.y) {
            const path = tracePath(current);
            return { steps, found: true, path };
        }

        for (const n of getNeighbors(grid, current)) {
            if (closedSet.has(`${n.x},${n.y}`)) continue;

            const cost = n.weight || 1;
            const tentG = current.g + cost;

            if (tentG < n.g) {
                n.parent = current;
                n.g = tentG;
                n.h = getManhattanDistance(n, end);
                
                if (mode === 'astar') n.f = n.g + n.h;
                else if (mode === 'greedy') n.f = n.h;
                else n.f = n.g; // ucs

                openList.push(n, n.f);
                steps.push({ type: 'frontier', x: n.x, y: n.y, f: n.f, g: n.g, h: n.h });
            }
        }
    }
    return { steps, found: false };
};

export const aStar = (grid: GridMap, start: Node, end: Node) => runWeightedSearch(grid, start, end, 'astar');
export const ucs = (grid: GridMap, start: Node, end: Node) => runWeightedSearch(grid, start, end, 'ucs');
export const greedy = (grid: GridMap, start: Node, end: Node) => runWeightedSearch(grid, start, end, 'greedy');

// ── Breach Search (Real-World AI Problem Solving) ──
export const runBreachSearch = (grid: GridMap, start: Node, end: Node): SearchResult => {
    const openList = new PriorityQueue<Node>();
    const closedSet = new Set<string>();

    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid[x].length; y++) {
            grid[x][y].g = Infinity;
            grid[x][y].parent = null;
        }
    }

    start.g = 0;
    start.h = getManhattanDistance(start, end);
    start.f = start.h;
    openList.push(start, start.f);

    while (!openList.isEmpty()) {
        const current = openList.pop()!;
        const key = `${current.x},${current.y}`;

        if (closedSet.has(key)) continue;
        closedSet.add(key);

        if (current.x === end.x && current.y === end.y) {
            const path = tracePath(current);
            const breachNodes = path.filter(n => n.isObstacle);
            return { steps: [], found: true, path, breachNodes };
        }

        const { x, y } = current;
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dx, dy] of directions) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length) {
                const neighbor = grid[nx][ny];
                if (closedSet.has(`${nx},${ny}`)) continue;

                // CRITICAL: Treat obstacles as traversable but with EXTREME cost
                const travelCost = neighbor.isObstacle ? 500 : (neighbor.weight || 1);
                const tentG = current.g + travelCost;

                if (tentG < neighbor.g) {
                    neighbor.parent = current;
                    neighbor.g = tentG;
                    neighbor.h = getManhattanDistance(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    openList.push(neighbor, neighbor.f);
                }
            }
        }
    }
    return { steps: [], found: false };
};

export const calculateBackupCost = (path: Node[]): number => {
    let cost = 0;
    path.forEach(node => {
        if (node.isObstacle) cost += 40; // Wall Breach
        else if (node.type === 'tree') cost += 5; // Eco Canopy Drag
    });
    return cost;
};
