import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, X, Activity, Timer, Map, Layers } from 'lucide-react';
import type { AlgorithmType } from '../logic/pathfinding';

interface CompResult {
  id: AlgorithmType;
  name: string;
  nodes: number;
  path: number;
  ms: number;
  found: boolean;
}

interface ComparisonModalProps {
  results: CompResult[];
  isOpen: boolean;
  onClose: () => void;
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ results, isOpen, onClose }) => {
  if (!results.length) return null;

  // Find winners in each category
  const minTime = Math.min(...results.filter(r => r.found).map(r => r.ms));
  const minPath = Math.min(...results.filter(r => r.found).map(r => r.path));
  const minNodes = Math.min(...results.filter(r => r.found).map(r => r.nodes));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-4xl bg-[#0f1320] border-2 border-[#1e2838] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative"
          >
            {/* Tactical Header */}
            <div className="h-14 border-b border-[#1e2838] bg-[#141720] flex items-center px-6 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#7eb8f7] rotate-45" />
                <span className="text-[12px] font-black uppercase tracking-[0.3em] text-[#7eb8f7]">Mission Comparison Report</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors group"
              >
                <X size={18} className="text-[#3a5070] group-hover:text-white" />
              </button>
            </div>

            {/* Comparison Grid */}
            <div className="p-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((res) => (
                  <div 
                    key={res.id} 
                    className={`bg-[#0d0f14] border-t-2 p-4 flex flex-col gap-3 relative overflow-hidden transition-all duration-500 ${
                        res.found ? 'border-[#2a2f3e]' : 'border-[#3a1a1a] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-white uppercase tracking-wider">{res.name}</span>
                      {!res.found && <span className="text-[9px] text-[#e05050] font-black opacity-80">UNREACHABLE</span>}
                    </div>

                    <div className="flex flex-col gap-2 mt-2">
                      {/* Time Metric */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2 text-[#3a5060]">
                          <Timer size={12} />
                          <span className="text-[9px] uppercase font-bold tracking-tighter">Latency</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-[12px] font-mono ${res.found && res.ms === minTime ? 'text-[#39FF14]' : ''}`}>{res.ms}ms</span>
                            {res.found && res.ms === minTime && <Award size={12} className="text-[#39FF14]" />}
                        </div>
                      </div>

                      {/* Path Metric */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2 text-[#3a5060]">
                          <Map size={12} />
                          <span className="text-[9px] uppercase font-bold tracking-tighter">Path Units</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-[12px] font-mono ${res.found && res.path === minPath ? 'text-[#39FF14]' : ''}`}>{res.found ? res.path : '—'}</span>
                            {res.found && res.path === minPath && <Award size={12} className="text-[#39FF14]" />}
                        </div>
                      </div>

                      {/* Node Metric */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#3a5060]">
                          <Layers size={12} />
                          <span className="text-[9px] uppercase font-bold tracking-tighter">Sweep Area</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-[12px] font-mono ${res.found && res.nodes === minNodes ? 'text-[#39FF14]' : ''}`}>{res.nodes}</span>
                            {res.found && res.nodes === minNodes && <Award size={12} className="text-[#39FF14]" />}
                        </div>
                      </div>
                    </div>

                    {/* Performance Grade Map (Subtle Background) */}
                    <div className="absolute top-0 right-0 p-1 opacity-5 select-none pointer-events-none">
                        <Activity size={80} strokeWidth={1} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tactical Summary Footer */}
              <div className="mt-4 p-4 border-l-4 border-[#3a7bd5] bg-[#141720]/50">
                <h4 className="text-[10px] text-[#3a7bd5] uppercase tracking-[0.2em] font-black mb-2 flex items-center gap-2">
                    <Award size={14} /> Intel Analytics Conclusion
                </h4>
                <p className="text-[11px] text-[#556070] leading-relaxed italic">
                  Based on the mission parameters, the <span className="text-white font-bold">{results.find(r => r.ms === minTime && r.found)?.name || 'N/A'}</span> algorithm provided the lowest latency return, while <span className="text-white font-bold">{results.find(r => r.path === minPath && r.found)?.name || 'N/A'}</span> secured the optimal trajectory. Recommendation based on tactical balance: <span className="text-[#39FF14] font-bold">A* OPTIMA</span>.
                </p>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="px-8 pb-8 pt-2 flex justify-end">
              <button 
                onClick={onClose}
                className="industrial-btn bg-[#1e2838] border-[#3a5070] text-white hover:bg-[#2a3a50] py-2 px-8"
              >
                Acknowledge & Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ComparisonModal;
