import React from 'react';
import type { AlgorithmType } from '../logic/pathfinding';

interface SidebarProps {
  selectedAlgos: AlgorithmType[];
  toggleAlgo: (a: AlgorithmType) => void;
  currentTool: string;
  setTool: (t: string) => void;
  stats: { nodes: number, path: number, ms: number, queue: number };
  isCompareMode: boolean;
  setCompareMode: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedAlgos,
  toggleAlgo,
  currentTool,
  setTool,
  stats,
  isCompareMode,
  setCompareMode,
}) => {
  return (
    <div className="sidebar-container bg-[#141720] border-r border-[#2a2f3e] w-[260px] min-w-[260px] p-3 flex flex-col gap-6 overflow-y-auto">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <div className="text-[9px] text-[#3a5070] uppercase tracking-[1.5px] font-bold">Algorithms</div>
          <button 
            onClick={() => setCompareMode(!isCompareMode)}
            className={`text-[8px] px-2 py-1 rounded border transition-all font-black tracking-widest ${
              isCompareMode ? 'bg-[#3a7bd5] border-[#7eb8f7] text-white shadow-[0_0_10px_#3a7bd5]' : 'bg-transparent border-[#2a2f3e] text-[#3a5070]'
            }`}
          >
            {isCompareMode ? 'COMPARE ON' : 'COMPARE OFF'}
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {[
            { id: 'astar', name: '1 · A* Optima Search' },
            { id: 'ucs', name: '2 · UCS Secure Sweep' },
            { id: 'bfs', name: '3 · Breadth-First' },
            { id: 'dfs', name: '4 · Depth-First Search' },
            { id: 'greedy', name: '5 · Greedy Best-First' },
          ].map((algo) => (
            <button
              key={algo.id}
              onClick={() => toggleAlgo(algo.id as AlgorithmType)}
              className={`text-left px-3 py-2 text-[11px] rounded transition-all flex items-center justify-between ${
                selectedAlgos.includes(algo.id as AlgorithmType) 
                    ? 'bg-[#0f1a2a] text-[#7eb8f7] border-l-2 border-[#3a7bd5] shadow-[inset_0_0_15px_rgba(58,123,213,0.1)]' 
                    : 'text-[#556070] hover:bg-[#1a2030]'
              }`}
            >
              <span>{algo.name}</span>
              {selectedAlgos.includes(algo.id as AlgorithmType) && isCompareMode && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#7eb8f7] shadow-[0_0_5px_#7eb8f7]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[9px] text-[#3a5070] uppercase tracking-[1.5px] mb-3 font-bold">Tactical Tools</div>
        <div className="flex flex-col gap-1">
          {[
            { id: 'building', name: '▪ BUILDING (WALL)', shortcut: '[Single Unit]' },
            { id: 'tree', name: '▲ FORESTRY (TREE)', shortcut: '[3-Click Stage]' },
            { id: 'erase', name: '◻ ERASER', shortcut: '[E] Clean' },
            { id: 'start', name: 'S · START POSITION', shortcut: '[S] Origin' },
            { id: 'goal', name: 'G · GOAL POSITION', shortcut: '[G] Objective' },
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() => setTool(tool.id)}
              className={`text-left px-3 py-2 text-[11px] rounded transition-all group flex flex-col ${
                currentTool === tool.id ? 'bg-[#0f2a0f] text-[#5eda5e] border-l-2 border-[#2aaa2a]' : 'text-[#556070] hover:bg-[#1a2030]'
              }`}
            >
              <span className="font-bold">{tool.name}</span>
              <span className="text-[8px] opacity-40 group-hover:opacity-100">{tool.shortcut}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[9px] text-[#3a5070] uppercase tracking-[1.5px] mb-3 font-bold">Telemetry</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Sectors', value: stats.nodes },
            { label: 'Path', value: stats.path || '—' },
            { label: 'Time', value: `${stats.ms}ms` },
            { label: 'Queue', value: stats.queue },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0f1320] border border-[#1a2030] p-2 text-center rounded">
              <div className="text-[14px] font-bold text-[#7eb8f7]">{stat.value}</div>
              <div className="text-[8px] text-[#3a5060] uppercase tracking-tighter">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-[#1e2838]">
        <div className="text-[9px] text-[#3a5060] leading-relaxed mb-4">
          SPACE · RUN/STOP<br />
          R · RESET &nbsp; C · CLEAR<br />
          P · MISSION PRESET
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
