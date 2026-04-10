import { useState, useEffect, useCallback, useRef } from 'react';
import Grid from './components/Grid';
import Sidebar from './components/Sidebar';
import StatusBar from './components/StatusBar';
import InfoBar from './components/InfoBar';
import ComparisonModal from './components/ComparisonModal';
import { bfs, dfs, aStar, ucs, greedy, runBreachSearch, calculateBackupCost, type GridMap, type SearchStep, type AlgorithmType } from './logic/pathfinding';

const COLS = 24, ROWS = 16;
const NORMAL_SPEED = 15; // slightly faster for tactical feel

const createEmptyGrid = (cols: number, rows: number): GridMap => {
  return Array.from({ length: cols }, (_, x) =>
    Array.from({ length: rows }, (_, y) => ({
      x, y, g: Infinity, h: Infinity, f: Infinity, parent: null, weight: 1, isObstacle: false, size: 0, type: 'empty'
    }))
  );
};

const MISSION_PRESETS = [
    {
      name: 'Delta Sector (Forestry)',
      walls: [[4,4],[4,5],[4,6],[4,7],[4,8],[4,9],[4,10],[13,6],[13,7],[13,8],[13,9],[18,6],[18,7],[18,8],[18,9],[18,10],[18,11],[18,12]],
      trees: [[10,4],[10,5],[10,6],[11,6],[12,6],[10,12],[11,12],[12,12]]
    },
    {
      name: 'High Density (Hard)',
      walls: (() => {
        const w = [];
        for (let x = 4; x < 20; x += 4) {
          for (let y = 0; y < ROWS; y++) {
            if (y !== 3 && y !== 7 && y !== 11) w.push([x, y]);
          }
        }
        return w;
      })(),
      trees: [[2,2],[2,3],[22,12],[22,13]]
    },
    {
        name: 'Training Grounds (Easy)',
        walls: [[12, 4], [12, 5], [12, 6], [12, 7], [12, 8], [12, 9]],
        trees: [[12, 10], [12, 11], [11,11],[13,11]]
    }
];

export default function App() {
  const [grid, setGrid] = useState<GridMap>(createEmptyGrid(COLS, ROWS));
  const [startNode, setStartNode] = useState({ x: 2, y: ROWS >> 1 });
  const [goalNode, setGoalNode] = useState({ x: COLS - 3, y: ROWS >> 1 });
  const [selectedAlgos, setSelectedAlgos] = useState<AlgorithmType[]>(['astar']);
  const [isCompareMode, setCompareMode] = useState(false);
  const [currentTool, setTool] = useState('building');
  const [isRunning, setIsRunning] = useState(false);
  const [animSteps, setAnimSteps] = useState<{ [key: string]: 'frontier' | 'explored' | 'path' }>({});
  const [stats, setStats] = useState({ nodes: 0, path: 0, ms: 0, queue: 0 });
  const [status, setStatus] = useState<{type: 'ready' | 'running' | 'done' | 'fail', text: string}>({ type: 'ready', text: 'Ready — set mission parameters then click RUN' });
  const [heuristics, setHeuristics] = useState<{ g: number, h: number, f: number } | undefined>();
  const [presetIdx, setPresetIdx] = useState(0);
  const [compResults, setCompResults] = useState<any[]>([]);
  const [showCompModal, setShowCompModal] = useState(false);
  const [backupFuel, setBackupFuel] = useState(100);
  const [pendingBreach, setPendingBreach] = useState<{ path: any[], fuelCost: number, breachNodes: any[] } | null>(null);

  const animTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animIndexRef = useRef(0);
  const searchStepsRef = useRef<SearchStep[]>([]);

  const resetViz = useCallback((keepObstacles = true) => {
    if (animTimerRef.current) clearInterval(animTimerRef.current);
    setIsRunning(false);
    animIndexRef.current = 0;
    setAnimSteps({});
    setStats({ nodes: 0, path: 0, ms: 0, queue: 0 });
    setHeuristics(undefined);
    setPendingBreach(null);
    setStatus({ type: 'ready', text: 'HUD Reset — Waiting for commands' });

    if (!keepObstacles) {
        setGrid(createEmptyGrid(COLS, ROWS));
    }
  }, []);

  const runAlgorithm = useCallback((algoId: AlgorithmType): Promise<any> => {
    return new Promise((resolve) => {
        resetViz(true);
        const startTime = performance.now();
        const algos = { bfs, dfs, astar: aStar, ucs, greedy };
        const algoNameMap = { bfs: 'Breadth-First', dfs: 'Depth-First', astar: 'A* Optima', ucs: 'UCS Secure', greedy: 'Greedy Fast' };
        const result = algos[algoId](grid, grid[startNode.x][startNode.y], grid[goalNode.x][goalNode.y]);
        
        searchStepsRef.current = result.steps;
        setIsRunning(true);
        setStatus({ type: 'running', text: `Executing ${algoNameMap[algoId]} sweep…` });

        animTimerRef.current = setInterval(() => {
            if (animIndexRef.current >= searchStepsRef.current.length) {
                clearInterval(animTimerRef.current!);
                setIsRunning(false);
                const endTime = performance.now();
                const latency = Math.round(endTime - startTime);
                
                if (result.found && result.path) {
                    const pathSteps: { [key: string]: 'path' } = {};
                    result.path.forEach(n => pathSteps[`${n.x},${n.y}`] = 'path');
                    setAnimSteps((prev) => ({ ...prev, ...pathSteps }));
                    setStats((prev) => ({ ...prev, path: result.path!.length, ms: latency }));
                    setStatus({ type: 'done', text: `✓ ${algoNameMap[algoId]} Success — Found in ${latency}ms` });
                    resolve({ id: algoId, name: algoNameMap[algoId], nodes: result.steps.filter(s => s.type === 'explored').length, path: result.path.length, ms: latency, found: true });
                } else if (!result.found && !isCompareMode) {
                    // INTERACTIVE PROBLEM SOLVING: Trigger Breach Scan if stuck
                    setStatus({ type: 'running', text: 'PATH BLOCKED. Analyzing structural bypass...' });
                    const breachRes = runBreachSearch(grid, grid[startNode.x][startNode.y], grid[goalNode.x][goalNode.y]);
                    
                    if (breachRes.found && breachRes.path && breachRes.breachNodes) {
                        const fuelCost = calculateBackupCost(breachRes.path);
                        if (backupFuel >= fuelCost) {
                            setPendingBreach({ path: breachRes.path, fuelCost, breachNodes: breachRes.breachNodes });
                            setStatus({ type: 'fail', text: '⚠ BLOCKAGE DETECTED // AUTHORIZATION REQUIRED' });
                        } else {
                            setStatus({ type: 'fail', text: '✗ CRITICAL: Backup Fuel Exhausted! Unit Lost.' });
                        }
                    } else {
                        setStatus({ type: 'fail', text: `✗ ${algoNameMap[algoId]} Failed — Target unreachable!` });
                    }
                    resolve({ id: algoId, name: algoNameMap[algoId], nodes: 0, path: 0, ms: 0, found: false });
                } else {
                    setStatus({ type: 'fail', text: `✗ ${algoNameMap[algoId]} Failed — Target unreachable!` });
                    resolve({ id: algoId, name: algoNameMap[algoId], nodes: result.steps.filter(s => s.type === 'explored').length, path: 0, ms: latency, found: false });
                }
                return;
            }

            const step = searchStepsRef.current[animIndexRef.current];
            
            if (step.x === goalNode.x && step.y === goalNode.y && step.type === 'explored') {
                clearInterval(animTimerRef.current!);
                const latency = Math.round(performance.now() - startTime);
                if (result.path) {
                     const pathSteps: { [key: string]: 'path' } = {};
                     result.path.forEach(n => pathSteps[`${n.x},${n.y}`] = 'path');
                     setAnimSteps((prev) => ({ ...prev, ...pathSteps }));
                     setStats(prev => ({...prev, path: result.path!.length, ms: latency }));
                     setStatus({ type: 'done', text: `✓ ${algoNameMap[algoId]} Secured — ${latency}ms` });
                     resolve({ id: algoId, name: algoNameMap[algoId], nodes: result.steps.filter(s => s.type === 'explored').length, path: result.path.length, ms: latency, found: true });
                }
                setIsRunning(false);
                return;
            }

            if (step.type === 'frontier') {
                setAnimSteps(prev => ({ ...prev, [`${step.x},${step.y}`]: 'frontier' }));
            } else if (step.type === 'explored') {
                setAnimSteps(prev => ({ ...prev, [`${step.x},${step.y}`]: 'explored' }));
                setStats(prev => ({ ...prev, nodes: step.nodesNum || prev.nodes, queue: step.queueSz || prev.queue }));
            } else if (step.type === 'heuristics') {
                setHeuristics({ g: step.g!, h: step.h!, f: step.f! });
            }
            animIndexRef.current++;
        }, NORMAL_SPEED);
    });
  }, [grid, startNode, goalNode, resetViz, backupFuel]);

  const handleRun = useCallback(async () => {
    if (isRunning) {
        resetViz(true);
        return;
    }

    if (isCompareMode) {
        const results = [];
        for (const algoId of selectedAlgos) {
            const res = await runAlgorithm(algoId);
            results.push(res);
            // Brief pause between runs for operator awareness
            await new Promise(r => setTimeout(r, 800));
        }
        setCompResults(results);
        setShowCompModal(true);
    } else {
        runAlgorithm(selectedAlgos[0]);
    }
  }, [isRunning, isCompareMode, selectedAlgos, runAlgorithm, resetViz]);

  const handleInitiateBreach = useCallback(() => {
    if (!pendingBreach) return;

    const { fuelCost, breachNodes } = pendingBreach;
    setBackupFuel(prev => Math.max(0, prev - fuelCost));
    
    setGrid(prev => {
        const newGrid = [...prev.map(col => [...col])];
        breachNodes.forEach(n => {
            const node = newGrid[n.x][n.y];
            node.isObstacle = false;
            node.isBreached = true;
            node.type = 'empty';
        });
        return newGrid;
    });

    setPendingBreach(null);
    // Auto-restart selected algorithm
    setTimeout(() => runAlgorithm(selectedAlgos[0]), 300);
  }, [pendingBreach, runAlgorithm, selectedAlgos]);

  const handleRefillFuel = useCallback(() => {
    setBackupFuel(100);
    setStatus({ type: 'ready', text: 'SYSTEM REFILLED — Backup Fuel at 100%' });
  }, []);

  const handleNodeUpdate = useCallback((x: number, y: number) => {
    if (isRunning) return;
    if ((x === startNode.x && y === startNode.y) || (x === goalNode.x && y === goalNode.y)) return;

    setGrid(prev => {
      const newGrid = [...prev.map(col => [...col])];
      const node = newGrid[x][y];

      if (currentTool === 'erase') {
        node.isObstacle = false;
        node.type = 'empty';
        node.weight = 1;
      } else if (currentTool === 'building') {
        const stage = (node.size || 0) + 1;
        if (stage > 3) {
            // Clean 3x3 area
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const nx = x + dx; const ny = y + dy;
                    if (newGrid[nx] && newGrid[nx][ny]) {
                        const n = newGrid[nx][ny];
                        if (n.type === 'building') { n.isObstacle = false; n.type = 'empty'; n.size = 0; }
                    }
                }
            }
            node.size = 0;
        } else if (stage === 1) {
            node.isObstacle = true;
            node.type = 'building';
            node.size = 1;
        } else {
            // Random scatter (2-3 buildings) in 3x3
            let count = Math.floor(Math.random() * 2) + 2; // 2 or 3
            let attempts = 0;
            while (count > 0 && attempts < 15) {
                const dx = Math.floor(Math.random() * 3) - 1;
                const dy = Math.floor(Math.random() * 3) - 1;
                const nx = x + dx; const ny = y + dy;
                if (newGrid[nx] && newGrid[nx][ny] && !newGrid[nx][ny].isObstacle && newGrid[nx][ny].type !== 'tree' && !((nx === startNode.x && ny === startNode.y) || (nx === goalNode.x && ny === goalNode.y))) {
                    newGrid[nx][ny].isObstacle = true;
                    newGrid[nx][ny].type = 'building';
                    newGrid[nx][ny].size = 1;
                    count--;
                }
                attempts++;
            }
            node.size = stage;
        }
      } else if (currentTool === 'tree') {
        const stage = (node.size || 0) + 1;
        if (stage > 3) {
            node.weight = 1; node.type = 'empty'; node.size = 0;
        } else {
            node.type = 'tree';
            node.size = stage;
            node.weight = stage === 1 ? 5 : stage === 2 ? 20 : 50;
        }
      } else if (currentTool === 'start') {
          setStartNode({x, y});
      } else if (currentTool === 'goal') {
          setGoalNode({x, y});
      }

      return newGrid;
    });
  }, [currentTool, isRunning, startNode, goalNode]);

  const cyclePreset = useCallback(() => {
    resetViz(false);
    const p = MISSION_PRESETS[presetIdx % MISSION_PRESETS.length];
    setPresetIdx(prev => prev + 1);
    
    setGrid(createEmptyGrid(COLS, ROWS).map((col, x) => 
        col.map((node, y) => {
            const isWall = p.walls.some(w => w[0] === x && w[1] === y);
            const isTree = p.trees?.some(w => w[0] === x && w[1] === y);
            if (isWall) return { ...node, isObstacle: true, type: 'building', size: 1 };
            if (isTree) return { ...node, type: 'tree', weight: 20, size: 2 };
            return node;
        })
    ));
    setStatus({ type: 'ready', text: `Loaded Mission: ${p.name}` });
  }, [presetIdx, resetViz]);

  const toggleAlgo = useCallback((algoId: AlgorithmType) => {
    if (isCompareMode) {
        setSelectedAlgos(prev => 
            prev.includes(algoId) 
                ? (prev.length > 1 ? prev.filter(a => a !== algoId) : prev) 
                : [...prev, algoId]
        );
    } else {
        setSelectedAlgos([algoId]);
    }
  }, [isCompareMode]);

  // Keyboard shortcuts
  useEffect(() => {
    (window as any).resetTacticalGrid = () => {
        resetViz(false);
        setBackupFuel(100);
    };
    (window as any).clearTacticalResults = () => resetViz(true);
    (window as any).refillBackupFuel = handleRefillFuel;
  }, [resetViz, handleRefillFuel]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); handleRun(); }
      else if (e.key === 'r') resetViz();
      else if (e.key === 'c') resetViz(false);
      else if (e.key === 'p') cyclePreset();
      else if (e.key === '1') toggleAlgo('astar');
      else if (e.key === '2') toggleAlgo('ucs');
      else if (e.key === '3') toggleAlgo('bfs');
      else if (e.key === '4') toggleAlgo('dfs');
      else if (e.key === '5') toggleAlgo('greedy');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRun, resetViz, cyclePreset, toggleAlgo]);

  return (
    <div className="h-screen flex flex-col bg-[#0d0f14] text-[#c8d0e0] font-mono select-none overflow-hidden">
      <div className="h-12 bg-[#141720] border-b border-[#2a2f3e] px-4 flex items-center gap-4 shrink-0">
        <div>
          <div className="text-[16px] font-bold text-[#7eb8f7] tracking-widest uppercase">DSSP CORE V2</div>
          <div className="text-[9px] text-[#4a5568]">Standalone Tactical Search Interface</div>
        </div>
        <div className="ml-auto flex gap-2">
            <button className="industrial-btn" onClick={cyclePreset}>⊞ PRESET</button>
            <button className="industrial-btn btn-run" onClick={handleRun}>
                {isRunning ? '■ STOP' : '▶ RUN'}
            </button>
            <button className="industrial-btn" onClick={() => resetViz()}>↺ RESET</button>
            <button className="industrial-btn btn-clear" onClick={() => resetViz(false)}>✕ CLEAR</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedAlgos={selectedAlgos}
          toggleAlgo={toggleAlgo}
          currentTool={currentTool}
          setTool={setTool}
          stats={stats}
          isCompareMode={isCompareMode}
          setCompareMode={(v) => {
              setCompareMode(v);
              if (!v) setSelectedAlgos([selectedAlgos[0]]);
          }}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Grid 
            grid={grid}
            onNodeUpdate={handleNodeUpdate}
            startNode={startNode}
            goalNode={goalNode}
            animationSteps={animSteps}
            targetNodes={pendingBreach?.breachNodes || []}
          />
          <InfoBar algorithm={selectedAlgos[0]} />
        </div>
      </div>

      <StatusBar 
        status={status.type} 
        text={status.text} 
        heuristics={heuristics} 
        backupFuel={backupFuel} 
        onBreach={handleInitiateBreach}
        hasPendingBreach={!!pendingBreach}
      />
      
      <ComparisonModal 
        results={compResults} 
        isOpen={showCompModal} 
        onClose={() => setShowCompModal(false)} 
      />
    </div>
  );
}
