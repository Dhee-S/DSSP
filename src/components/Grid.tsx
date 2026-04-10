import React, { useState, useRef, useEffect } from 'react';
import type { Node } from '../logic/pathfinding';
import { Plane, LifeBuoy, Building2, Trees, Target } from 'lucide-react';

interface GridProps {
  grid: Node[][];
  onNodeUpdate: (x: number, y: number) => void;
  startNode: { x: number, y: number };
  goalNode: { x: number, y: number };
  animationSteps?: { [key: string]: 'frontier' | 'explored' | 'path' };
  targetNodes?: { x: number, y: number }[];
}

const Grid: React.FC<GridProps> = ({
  grid,
  onNodeUpdate,
  startNode,
  goalNode,
  animationSteps = {},
  targetNodes = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ w: 0, h: 0, cellSize: 0 });

  const COLS = grid.length;
  const ROWS = grid[0]?.length || 0;

  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsMouseDown(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const handleInteraction = (x: number, y: number) => {
    onNodeUpdate(x, y);
  };

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const padding = 32;
        const availableW = width - padding;
        const availableH = height - padding;

        if (availableW <= 0 || availableH <= 0) return;

        const cellSize = Math.floor(Math.min(availableW / COLS, availableH / ROWS));
        
        setMetrics({
          w: cellSize * COLS,
          h: cellSize * ROWS,
          cellSize
        });
      }
    });

    if (containerRef.current) {
        observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [COLS, ROWS]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 w-full h-full bg-[#0d0f14] flex items-center justify-center p-4 overflow-hidden relative"
    >
      <div 
        className="grid bg-[#131620] border border-[#2a2f3e] shadow-2xl relative transition-transform duration-[1200ms] ease-in-out will-change-transform"
        style={{
          width: metrics.w > 0 ? `${metrics.w}px` : 'auto',
          height: metrics.h > 0 ? `${metrics.h}px` : 'auto',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {Array.from({ length: ROWS }).map((_, y) => 
          Array.from({ length: COLS }).map((_, x) => {
            const node = grid[x][y];
            const isStart = x === startNode.x && y === startNode.y;
            const isGoal = x === goalNode.x && y === goalNode.y;
            const animState = animationSteps[`${x},${y}`];
            
            let bgColor = '#0d0f14';
            let borderColor = '#1a1d26';
            let zIndex = 'z-0';

            if (node.isObstacle) {
              bgColor = '#1a1d26';
              borderColor = '#3a4455';
            } else if (isStart) {
              bgColor = '#1a3a6a';
              borderColor = '#3a7bd5';
              zIndex = 'z-20';
            } else if (isGoal) {
              bgColor = '#3a1a1a';
              borderColor = '#e05050';
              zIndex = 'z-20';
            } else if (animState === 'path') {
              // Tactical Shift: Cyan Overdrive when passing over trees
              bgColor = node.type === 'tree' ? '#003b3d' : '#3a0f0f';
              borderColor = node.type === 'tree' ? '#00f2ff' : '#e05050';
              zIndex = 'z-10';
            } else if (animState === 'frontier') {
              bgColor = '#3a2a08';
              borderColor = '#d0a020';
            } else if (animState === 'explored') {
              bgColor = '#1e0f30';
              borderColor = '#7840a8';
            } else if (node.isBreached) {
              bgColor = '#3a2008';
              borderColor = '#ff8c00';
              zIndex = 'z-10';
            } else if (node.type === 'tree') {
              // Growth visualization stages
              const treeColors = ['#2aaa2a', '#1e7d1e', '#134e13'];
              const idx = (node.size || 1) - 1;
              bgColor = '#0d0f14';
              borderColor = treeColors[Math.min(idx, 2)];
            }

            return (
              <div
                key={`${x}-${y}`}
                onMouseDown={() => {
                  setIsMouseDown(true);
                  handleInteraction(x, y);
                }}
                onMouseEnter={() => {
                  if (isMouseDown) handleInteraction(x, y);
                }}
                style={{ 
                  backgroundColor: bgColor, 
                  borderColor: borderColor,
                  // Ensure square cells by setting explicit dimension
                  width: `${metrics.cellSize}px`,
                  height: `${metrics.cellSize}px`,
                  position: 'relative',
                  zIndex: zIndex === 'z-20' ? 20 : zIndex === 'z-10' ? 10 : 0
                }}
                className={`border-[0.5px] transition-all duration-75 flex items-center justify-center select-none cursor-crosshair box-border ${zIndex} ${
                  isStart ? 'node-glow-start scale-[1.15] rounded-sm' : 
                  isGoal ? 'node-glow-goal scale-[1.15] rounded-sm' : 
                  node.isBreached ? 'node-glow-breached shadow-[0_0_15px_rgba(255,140,0,0.5)]' :
                  animState === 'path' ? (node.type === 'tree' ? 'node-glow-overdrive' : 'node-glow-path') : ''
                }`}
              >
                {isStart && <Plane size={metrics.cellSize * 0.6} className="text-[#7eb8f7]" />}
                {isGoal && (
                    <div className="flex flex-col items-center justify-center relative">
                        <LifeBuoy size={metrics.cellSize * 0.6} className="text-[#e05050]" />
                        <span className="absolute -bottom-1 text-[7px] font-bold text-[#e05050]">SOS</span>
                    </div>
                )}
                {!isStart && !isGoal && animState === 'path' && (
                    <div className={`w-1.5 h-1.5 rounded-full ${node.type === 'tree' ? 'bg-[#00f2ff] shadow-[0_0_8px_#00f2ff]' : 'bg-[#e05050] shadow-[0_0_8px_#e05050]'}`} />
                )}
                {node.isObstacle && !isStart && !isGoal && (
                    <Building2 size={metrics.cellSize * 0.5} className="text-[#3a4455] opacity-50" />
                )}
                {node.type === 'tree' && !isStart && !isGoal && (animState === 'explored' || animState === 'frontier' || !animState) && (
                    <Trees 
                        size={metrics.cellSize * 0.5} 
                        style={{ 
                            transform: `scale(${1 + (node.size || 1) * 0.15})`,
                            color: ['#2aaa2a', '#1e7d1e', '#134e13'][(node.size || 1) - 1]
                        }}
                        className={animState ? "opacity-20" : "opacity-60"} 
                    />
                )}
                {node.isBreached && (
                    <Target 
                        size={metrics.cellSize} 
                        className={`absolute text-[#ff3131] transition-opacity duration-300 ${animState === 'path' ? 'opacity-30' : 'opacity-60'}`} 
                    />
                )}
                
                {/* Precision Targeting Overlay */}
                {targetNodes.some(t => t.x === x && t.y === y) && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 border-2 border-[#ff3131] animate-[pulse_0.5s_infinite] shadow-[0_0_15px_rgba(255,49,49,0.8)]" />
                    <div className="absolute -top-6 whitespace-nowrap bg-[#ff3131] text-white text-[7px] font-black px-1.5 py-0.5 uppercase tracking-tighter shadow-lg">
                      [Target: Structural Weakness]
                    </div>
                    <Target size={metrics.cellSize} className="text-[#ff3131] opacity-60 animate-[spin_2s_linear_infinite]" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Grid;
