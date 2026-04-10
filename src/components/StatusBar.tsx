import React from 'react';
import { Fuel } from 'lucide-react';

interface StatusBarProps {
  status: 'ready' | 'running' | 'done' | 'fail';
  text: string;
  heuristics?: { g: number; h: number; f: number };
  backupFuel: number;
  onBreach?: () => void;
  hasPendingBreach: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ status, text, heuristics, backupFuel, onBreach, hasPendingBreach }) => {
  const getFuelColor = (fuel: number) => {
    if (fuel > 75) return '#39FF14';  // Secure Green
    if (fuel > 40) return '#FFD700';  // Gold Warning
    if (fuel > 15) return '#FF8C00';  // Amber Warning
    return '#FF3131';                 // Critical Volatile
  };

  const fuelColor = getFuelColor(backupFuel);

  return (
    <div className="h-10 bg-[#0a0c10] border-t border-[#161a22] px-4 flex items-center gap-6 text-[10px] text-[#3a4a5a] shrink-0 font-cyber">
      {hasPendingBreach && (
        <button 
          onClick={onBreach}
          className="bg-[#e05050] hover:bg-[#ff6060] text-white px-4 py-1 font-black uppercase tracking-[0.2em] animate-pulse shadow-[0_0_15px_rgba(224,80,80,0.4)] transition-all flex items-center gap-2"
        >
          <span className="text-[8px]">●</span> Initiate Breach Protocol
        </button>
      )}
      <div className="flex items-center gap-2 min-w-[200px]">
        <div className={`w-1.5 h-1.5 rounded-full ${
          status === 'running' ? 'bg-[#c09020] animate-pulse' :
          status === 'done' ? 'bg-[#2a8a2a]' :
          status === 'fail' ? 'bg-[#8a2a2a]' :
          'bg-[#2a5a2a]'
        }`} />
        <span className="uppercase tracking-widest">{text}</span>
      </div>

      {/* Backup Fuel Component */}
      <div className="flex items-center gap-3 px-4 border-l border-white/5 h-full group">
        <Fuel size={12} className={backupFuel < 20 ? "text-[#FF3131] animate-pulse" : "text-white/20"} />
        <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between items-center px-0.5">
                <span className="text-[8px] uppercase tracking-tighter opacity-40">Backup Fuel</span>
                <span className="text-[9px] font-bold" style={{ color: fuelColor }}>{Math.max(0, Math.floor(backupFuel))}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden w-full relative">
                <div 
                    className="h-full transition-all duration-500 ease-out shadow-[0_0_10px_currentColor]"
                    style={{ 
                        width: `${Math.max(0, backupFuel)}%`, 
                        backgroundColor: fuelColor,
                        color: fuelColor
                    }} 
                />
            </div>
        </div>
      </div>
      
      {heuristics && (
        <div className="ml-auto text-[#7840a8] font-mono flex gap-4">
          <div className="flex gap-1.5">
              <span className="opacity-30">G</span>
              <span className="text-white/40">{heuristics.g.toFixed(1)}</span>
          </div>
          <div className="flex gap-1.5">
              <span className="opacity-30">H</span>
              <span className="text-white/40">{heuristics.h.toFixed(1)}</span>
          </div>
          <div className="flex gap-1.5 underline decoration-dssp-primary/40 underline-offset-4">
              <span className="text-dssp-primary opacity-60">F</span>
              <span className="text-dssp-primary">{heuristics.f.toFixed(1)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusBar;
