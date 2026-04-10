import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, Cpu, Zap, Wifi } from 'lucide-react';

interface TerminalProps {
  logs: (string | React.ReactNode)[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="h-full flex flex-col bg-[#05050a]/80 backdrop-blur-3xl border border-dssp-primary/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)] clip-tactical relative overflow-hidden group/term">
      {/* Glitch Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-dssp-primary/[0.02] to-transparent opacity-0 group-hover/term:opacity-100 transition-opacity duration-700" />
      
      {/* Header with Stats */}
      <div className="flex flex-col gap-2 p-5 border-b border-white/5 bg-black/40 z-10">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-dssp-primary/10 border border-dssp-primary/30">
                 <TerminalIcon size={14} className="text-dssp-primary" />
              </div>
              <span className="text-[11px] font-cyber tracking-[0.3em] uppercase text-white font-black italic">Tactical_Console</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-2 h-2 rounded-full bg-dssp-accent animate-pulse shadow-[0_0_8px_var(--color-dssp-accent)]" />
               <span className="text-[9px] text-dssp-accent font-bold tracking-widest uppercase">Streaming</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-2">
            {[
                { label: 'CPU', value: '42%', color: 'text-dssp-primary' },
                { label: 'BUFF', value: '1.2GB', color: 'text-dssp-pink' },
                { label: 'LINK', value: 'LOW_LAT', color: 'text-dssp-accent' }
            ].map(stat => (
                <div key={stat.label} className="bg-white/[0.02] border border-white/5 p-1.5 flex flex-col">
                    <span className="text-[8px] text-white/20 uppercase tracking-tighter mb-1 font-bold">{stat.label}</span>
                    <span className={`text-[10px] font-data ${stat.color} tracking-widest`}>{stat.value}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Log Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 scrollbar-v3 custom-scrollbar z-10"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {logs.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center h-full opacity-20 gap-4"
            >
               <Cpu size={40} className="animate-pulse text-dssp-primary" />
               <span className="text-[10px] uppercase tracking-[0.5em] font-black italic">Initialising Data Feed...</span>
            </motion.div>
          ) : (
            logs.map((log, index) => {
              const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false, fractionalSecondDigits: 2 });
              return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={typeof log === 'string' ? log + index : index}
                    className={`
                      group/log py-2.5 px-3 border-l-2 border-transparent hover:border-dssp-primary hover:bg-white/[0.02] transition-all
                      ${index === 0 ? 'opacity-100' : 'opacity-60 hover:opacity-100'}
                    `}
                  >
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-[9px] font-data text-white/20">[{timestamp}]</span>
                        <div className="h-px flex-1 bg-white/[0.05]" />
                        <Zap size={8} className="text-dssp-pink opacity-50 group-hover/log:animate-bounce" />
                    </div>
                    <div className="text-[11px] font-data text-dssp-primary/90 leading-relaxed tracking-wider break-words selection:bg-dssp-primary selection:text-white">
                        <span className="text-dssp-accent mr-2">{'>>>'}</span>
                        {log}
                    </div>
                  </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <div className="p-3 bg-black/60 border-t border-white/5 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
              <Wifi size={10} className="text-dssp-primary font-bold" />
              <span className="text-[8px] text-white/20 uppercase tracking-[0.3em]">Encryption: 4096-RSA</span>
          </div>
          <span className="text-[8px] text-dssp-pink/30 uppercase font-black tracking-widest italic">DSSP_SECURE</span>
      </div>
    </div>
  );
};

export default Terminal;
