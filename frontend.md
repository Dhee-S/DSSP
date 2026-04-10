# AI Maze Solver — UI/UX Technical Style Guide

This document provides a modular breakdown of the frontend architecture, CSS specifications, and functional features of the AI Maze Solver.

## 1. Top Bar (Top Navigation)
The `topbar` handles global application state and primary execution control.
- **Container**: `background: #141720; border-bottom: 1px solid #2a2f3e; display: flex; align-items: center;`
- **Branding**:
  - `title`: AI MAZE SOLVER (`#7eb8f7`, bold, 2px spacing).
  - `subtitle`: Formulate → Search → Execute (`#4a5568`).
- **Primary Controls**:
  - `RUN` Button: Toggles the execution engine. States:
    - Idle: Vibrant green (`#1a3a1a`) with a simple "▶ RUN" label.
    - Active: Pulsing red (`#3a1a1a`) with a "■ STOP" label.
  - `RESET`: Restores the search state while preserving walls.
  - `CLEAR`: Full grid reset (removes walls, start, and goal).
  - `PRESET`: Cycles through pre-configured maze layouts (Easy, Medium, Hard, Random).

## 2. Side Panel (Side Toolbar)
The `toolbar` provides granular configuration for the search algorithms and drawing environment.
- **Surface**: `230px` fixed width, tactical dark surface (`#141720`).
- **Dividers (`sep`)**: `1px solid #1e2838`.

### 2.1 Algorithm Navigation
Allows selection and multi-toggling for comparison.
- **Selection Logic**: Click to select a single algo; click another to add it to the comparison set.
- **States**:
  - `active`: Primary selection (Blue glow, `#7eb8f7`).
  - `multi`: Comparison set selection (Green glow, `#5eda5e`).
- **Comparison Button**: `btn-compare` — Triggers a sequential animated run of all selected algorithms.

### 2.2 Draw Tools
Tools for defining the state space.
- **Wall**: Permanent obstacle placement.
- **Erase**: Individual cell clearing.
- **Set Start/Goal**: Draggable placement of 'S' and 'G' nodes.

### 2.3 Speed Controls
Execution throttle for the visualization loop.
- **Options**: Slow (60ms), Normal (20ms), Fast (5ms), Instant (0ms).
- **Control Styling**: `background: #1a1f2a; border: 1px solid #2a3040;` with blue highlight for active selection.

### 2.4 Statistics (Telemetry Box)
Grid-based display of search metrics.
- **Nodes**: Total expanded nodes in the current search.
- **Path**: Length of the optimal path found.
- **ms**: Execution time for the search phase.
- **Queue**: Real-time size of the frontier (LIFO/FIFO/Priority).

## 3. Main Grid (Interaction Layer)
The core visualization area.
- **Canvas (`mc`)**: Responsive drawing surface using pixel-perfect cell alignment.
- **Cell Aesthetics**:
  - `Start/Goal/Path`: Embedded glowing shadow effects (`shadowBlur: 5`).
  - `Frontier`: Dotted indicator for nodes waiting in the queue.
  - `Explored`: Dark purple trails showing visited nodes.
- **Interaction**: Mouse drag support for wall painting and right-click support for erasing.

## 4. Bottom Panel (Description & Status)
Dual-purpose feedback area.
- **Status Bar**: Low-profile bar (`#0a0c10`) with a "life-signal" pulsing dot.
- **Status Dot (`sdot`)**: Transitions from `done` (Green) to `fail` (Red) or `running` (Yellow Pulse).
- **Algorithm Description Pane**: Dynamic description of the currently selected strategy (logic, completeness, and optimality).
- **Heuristic Display**: Real-time math output for `f(n)` calculation during informed searches.

## 5. Comparison Modal (Analysis Dialog)
High-priority overlay for final cross-algorithm evaluation.
- **Aesthetic**: Glassmorphic overlay (`backdrop-filter: blur(8px)`) with tactical dark content surface.
- **Features**:
  - Summary table of average performance (path, efficiency, time).
  - Categorical "Winner" badges for **Shortest Path** and **Most Efficient**.
