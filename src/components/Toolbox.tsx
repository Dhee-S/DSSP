import { ShieldCheck, Flame, Trees, Play, Activity, Cpu, Layers, Zap, Radio, Target, Boxes } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AlgorithmType } from '../logic/pathfinding';

interface ToolboxProps {
  selectedTool: string;
  onSelect: (tool: string) => void;
  isSearching: boolean;
  onStart: () => void;
  selectedAlgorithm: AlgorithmType;
  onAlgorithmSelect: (algo: AlgorithmType) => void;
}

const tools = [
  { id: 'station', icon: ShieldCheck, label: 'Control HQ', color: '#BC13FE', desc: 'Secure Ground Hub', gradient: 'from-[#BC13FE]/20 to-transparent' },
  { id: 'emergency', icon: Target, label: 'Crisis Zone', color: '#39FF14', desc: 'Critical Incident', gradient: 'from-[#39FF14]/20 to-transparent' },
  { id: 'building', icon: Boxes, label: 'Urban Node', color: '#FF00E5', desc: 'Solid Obstruction', gradient: 'from-[#FF00E5]/20 to-transparent' },
  { id: 'tree', icon: Trees, label: 'Eco Canopy', color: '#FF8C00', desc: 'Bio-Density Filter', gradient: 'from-[#FF8C00]/20 to-transparent' },
];

const algos: { 
  id: AlgorithmType; 
  icon: any; 
  label: string; 
  desc: string; 
  props: { label: string, value: string, color: string }[] 
}[] = [
  { 
    id: 'astar', 
    icon: Zap, 
    label: 'A* OPTIMA', 
    desc: 'Heuristic-balanced urban recon sweep.',
    props: [
        { label: 'Latency', value: '4ms', color: '#BC13FE' },
        { label: 'Risk', value: '0.01%', color: '#39FF14' },
        { label: 'Buffer', value: '100%', color: '#BC13FE' }
    ]
  },
  { 
    id: 'ucs', 
    icon: Layers, 
    label: 'UCS SECURE', 
    desc: 'Unbiased risk-averse route evaluation.',
    props: [
        { label: 'Latency', value: '12ms', color: '#FF00E5' },
        { label: 'Risk', value: 'Min', color: '#39FF14' },
        { label: 'Buffer', value: '98%', color: '#FF00E5' }
    ]
  },
  { 
    id: 'greedy', 
    icon: Activity, 
    label: 'GREEDY FAST', 
    desc: 'Proximity-first high-speed trajectory.',
    props: [
        { label: 'Latency', value: '1ms', color: '#FF8C00' },
        { label: 'Risk', value: 'Critical', color: '#FF3131' },
        { label: 'Buffer', value: '85%', color: '#FF8C00' }
    ]
  },
  { 
    id: 'bfs', 
    icon: Cpu, 
    label: 'BFS GLOBAL', 
    desc: 'Shortest-path distance priority.',
    props: [
        { label: 'Latency', value: '25ms', color: '#FFFFFF' },
        { label: 'Risk', value: 'Med', color: '#FF8C00' },
        { label: 'Buffer', value: '90%', color: '#FFFFFF' }
    ]
  },
];

const Toolbox: React.FC<ToolboxProps> = ({ 
  selectedTool, onSelect, isSearching, onStart, selectedAlgorithm, onAlgorithmSelect 
}) => {
  return (
    <div className="flex flex-col gap-6 z-50 h-full">
      <div className="glass-industrial border-l-4 border-dssp-primary p-4 flex flex-col gap-6 items-center shadow-2xl relative group/toolbox min-w-[80px] h-full">
        
        {/* Algorithm Switcher Rail */}
        <div className="flex flex-col gap-3 mb-6 p-1.5 bg-black/40 border border-white/5 w-14">
            {algos.map((algo) => (
                <div key={algo.id} className="relative group/algo">
                    <button
                        onClick={() => onAlgorithmSelect(algo.id)}
                        className={`
                            w-11 h-11 flex items-center justify-center transition-all duration-500 relative
                            ${selectedAlgorithm === algo.id 
                                ? 'bg-dssp-primary text-[#05050a] shadow-[0_0_20px_rgba(188,19,254,0.6)]' 
                                : 'text-white/30 hover:text-white/80 hover:bg-white/5'}
                        `}
                    >
                        <algo.icon size={20} />
                        {selectedAlgorithm === algo.id && (
                            <div className="absolute inset-0 border-2 border-white/40 mix-blend-overlay" />
                        )}
                    </button>
                    
                    {/* High-Fidelity Algorithm Tooltip */}
                    <div className="absolute left-20 top-0 opacity-0 group-hover/algo:opacity-100 pointer-events-none z-50 transition-all duration-300 translate-x-[-15px] group-hover/algo:translate-x-0 w-max">
                        <div className="bg-[#05050a]/95 border-l-4 border-dssp-primary p-5 backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] flex flex-col gap-4 min-w-[240px]">
                           <div className="flex flex-col border-b border-white/10 pb-3">
                               <div className="flex items-center gap-2 mb-1">
                                  <Radio size={12} className="text-dssp-primary animate-pulse" />
                                  <span className="text-[11px] font-cyber text-dssp-primary uppercase tracking-[0.2em] font-black">{algo.label}</span>
                               </div>
                               <p className="text-[10px] text-white/40 uppercase tracking-widest leading-tight italic">{algo.desc}</p>
                           </div>
                           <div className="flex flex-col gap-3">
                               {algo.props.map(p => (
                                   <div key={p.label} className="grid grid-cols-2 items-center">
                                       <span className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-bold">{p.label}</span>
                                       <div className="flex flex-col items-end">
                                          <span className="text-[10px] font-data uppercase tracking-widest" style={{ color: p.color }}>{p.value}</span>
                                          <div className="w-16 h-0.5 bg-white/5 mt-1">
                                              <div className="h-full bg-current opacity-30" style={{ width: p.value, color: p.color }} />
                                          </div>
                                       </div>
                                   </div>
                               ))}
                           </div>
                           <div className="pt-2 border-t border-white/5 mt-1">
                               <span className="text-[8px] text-white/10 uppercase tracking-[0.4em]">Schematic: 0x8842-X</span>
                           </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="w-10 h-px bg-white/10 mb-2" />

        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            whileHover={{ scale: 1.1, x: 4 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(tool.id)}
            disabled={isSearching}
            className={`
              w-14 h-14 flex items-center justify-center relative group/btn
              border-b-4 transition-all duration-500
              ${selectedTool === tool.id 
                ? 'bg-white/10 opacity-100 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] translate-x-1' 
                : 'bg-transparent opacity-30 hover:opacity-100 hover:bg-white/5'}
            `}
            style={{ 
                borderBottomColor: selectedTool === tool.id ? tool.color : 'rgba(255,255,255,0.05)',
                color: tool.color,
                filter: selectedTool === tool.id ? `drop-shadow(0 0 15px ${tool.color}70)` : 'none'
            }}
          >
            <tool.icon size={26} strokeWidth={2.5} className="z-10" />
            
            {/* Vibrant Hover Tags */}
            <div className="absolute left-20 pl-8 opacity-0 group-hover/btn:opacity-100 pointer-events-none z-50 transition-all duration-300 translate-x-[-15px] group-hover/btn:translate-x-0">
                <div className={`
                    relative px-6 py-4 border-r-4 shadow-[30px_0_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl clip-tactical
                    bg-gradient-to-l ${tool.gradient}
                `} style={{ borderRightColor: tool.color }}>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-1.5">
                            <div className="w-2 h-2 rotate-45 animate-spin" style={{ backgroundColor: tool.color }} />
                            <span className="text-[13px] font-cyber uppercase tracking-[0.25em] text-white font-black">{tool.label}</span>
                        </div>
                        <span className="text-[9px] font-data text-white/30 uppercase tracking-[0.3em] leading-none">{tool.desc}</span>
                        <div className="mt-4 flex gap-1 opacity-20">
                            {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-1 bg-white" />)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Glow Marker */}
            {selectedTool === tool.id && (
                <div className="absolute inset-0 bg-current opacity-5 animate-pulse" />
            )}
          </motion.button>
        ))}

        <div className="flex-1" />

        <div className="flex flex-col gap-3 items-center w-full">
            {/* Maze Gen Trigger */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window as any).generateMazeGrid?.()}
                disabled={isSearching}
                className="w-14 h-14 flex items-center justify-center bg-black/40 border-b-2 border-white/10 hover:border-dssp-accent transition-all text-dssp-accent relative group/maze"
            >
                <Layers size={22} />
                <div className="absolute bottom-0 right-0 p-1 opacity-0 group-hover/maze:opacity-100">
                    <div className="w-1 h-1 bg-dssp-accent" />
                </div>
            </motion.button>

            {/* Reset Trigger with Tactical Sub-menu */}
            <div className="relative group/reset">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSearching}
                    className="w-14 h-14 flex items-center justify-center bg-black/40 border-b-2 border-white/10 group-hover/reset:border-dssp-pink transition-all text-dssp-pink shadow-[0_0_15px_rgba(255,0,229,0.1)]"
                >
                    <Zap size={22} className="group-hover/reset:animate-bounce" />
                </motion.button>
                
                {/* Reset Sub-menu */}
                <div className="absolute left-20 bottom-0 opacity-0 group-hover/reset:opacity-100 pointer-events-none group-hover/reset:pointer-events-auto z-50 transition-all duration-300 translate-x-[-15px] group-hover/reset:translate-x-0 w-max">
                    <div className="bg-[#05050a]/95 border-l-4 border-dssp-pink/50 p-1 backdrop-blur-3xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] flex flex-col gap-1 min-w-[200px]">
                        <button 
                            onClick={() => (window as any).clearTacticalResults?.()}
                            disabled={isSearching}
                            className="flex items-center gap-4 px-5 py-4 hover:bg-dssp-accent/10 transition-all group/opt border-b border-white/5 w-full text-left"
                        >
                            <Activity size={16} className="text-dssp-accent group-hover/opt:scale-125 transition-transform" />
                            <div className="flex flex-col items-start">
                                <span className="text-[11px] font-cyber text-dssp-accent uppercase tracking-widest font-black">Sweep Vector</span>
                                <span className="text-[9px] text-white/20 uppercase tracking-tighter">Clear Path Telemetry</span>
                            </div>
                        </button>
                        <button 
                            onClick={() => (window as any).refillBackupFuel?.()}
                            disabled={isSearching}
                            className="flex items-center gap-4 px-5 py-4 hover:bg-dssp-primary/10 transition-all group/opt border-b border-white/5 w-full text-left"
                        >
                            <Zap size={16} className="text-dssp-primary group-hover/opt:animate-spin" />
                            <div className="flex flex-col items-start">
                                <span className="text-[11px] font-cyber text-dssp-primary uppercase tracking-widest font-black">Refill Core</span>
                                <span className="text-[9px] text-white/20 uppercase tracking-tighter">Regenerate Backup Fuel</span>
                            </div>
                        </button>
                        <button 
                            onClick={() => (window as any).resetTacticalGrid?.()}
                            disabled={isSearching}
                            className="flex items-center gap-4 px-5 py-4 hover:bg-dssp-danger/10 transition-all group/opt w-full text-left"
                        >
                            <Flame size={16} className="text-dssp-danger group-hover/opt:animate-pulse" />
                            <div className="flex flex-col items-start">
                                <span className="text-[11px] font-cyber text-dssp-danger uppercase tracking-widest font-black">System Wipe</span>
                                <span className="text-[9px] text-white/20 uppercase tracking-tighter">Full Sector Purgation</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-10 h-px bg-white/10 my-2" />

            {/* Tactical Engagement Trigger */}
            <motion.button
              whileHover={{ scale: 1.05, filter: 'brightness(1.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              disabled={isSearching}
              className={`
                w-14 h-20 flex flex-col items-center justify-center z-10 transition-all duration-500
                ${isSearching 
                   ? 'bg-dssp-primary/20 text-dssp-primary border border-dssp-primary/50' 
                   : 'bg-dssp-primary text-[#05050a] shadow-[0_0_30px_rgba(188,19,254,0.5)]'}
              `}
            >
              {isSearching ? (
                 <Activity size={28} className="animate-spin" />
              ) : (
                <>
                  <Play size={32} fill="currentColor" className="translate-y-[-2px]" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-1">Engage</span>
                </>
              )}
            </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Toolbox;
