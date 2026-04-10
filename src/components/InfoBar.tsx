import React from 'react';
import type { AlgorithmType } from '../logic/pathfinding';

interface InfoBarProps {
  algorithm: AlgorithmType;
}

const ALGO_DESCRIPTIONS: Record<AlgorithmType, { name: string; desc: string }> = {
  bfs: {
    name: 'Breadth-First Search',
    desc: 'Explores all neighbors level by level using a FIFO queue. Guarantees shortest path when all edge costs are equal. Complete: YES | Optimal: YES',
  },
  dfs: {
    name: 'Depth-First Search',
    desc: 'Explores as deep as possible using a LIFO stack. Space-efficient but NOT guaranteed to find the shortest path. Complete: NO | Optimal: NO',
  },
  astar: {
    name: 'A* Search',
    desc: 'Uses f(n) = g(n) + h(n) where g(n) = cost from start, h(n) = Manhattan distance to goal. Guarantees optimal path when heuristic is admissible. Complete: YES | Optimal: YES',
  },
  ucs: {
    name: 'Uniform Cost Search',
    desc: 'Expands nodes in order of path cost using a priority queue. Equivalent to Dijkstra\'s algorithm. Optimal for non-negative cost graphs. Complete: YES | Optimal: YES',
  },
  greedy: {
    name: 'Greedy Best-First',
    desc: 'Uses only h(n) heuristic; always expands the node closest to goal. Fast but NOT guaranteed to find the optimal path. Complete: NO | Optimal: NO',
  },
};

const InfoBar: React.FC<InfoBarProps> = ({ algorithm }) => {
  const info = ALGO_DESCRIPTIONS[algorithm];
  return (
    <div className="bg-[#141720] border-t border-[#2a2f3e] p-3 flex flex-col gap-1 shrink-0">
      <div className="text-[11px] font-bold text-[#7eb8f7] tracking-[0.5px]">
        {info.name}
      </div>
      <div className="text-[10px] text-[#5a7090] leading-relaxed">
        {info.desc}
      </div>
    </div>
  );
};

export default InfoBar;
