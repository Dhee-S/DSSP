# DSSP: Drone Strategic Search Platform
### Advanced Pathfinding and Structural Breach Visualization System

## 📝 Overview
The Drone Strategic Search Platform (DSSP) is a high-fidelity simulation environment designed for visualizing advanced graph traversal algorithms within complex urban theaters. Unlike standard pathfinding visualizers, DSSP implements **Structural Breach Logic**, allowing the simulation to "neutralize" obstacles when a legal path is non-existent, governed by a persistent resource management system (Backup Fuel).

## 🚀 Key Concepts
### 1. Adaptive Pathfinding
The core of DSSP is built on several fundamental search strategies, each optimized for different mission parameters:
- **A* Optima**: Uses the Manhattan heuristic to balance cost and proximity, ensuring the most efficient route.
- **Dijkstra/UCS**: Prioritizes lowest cost, making it ideal for navigating through high-weight areas like "Eco-Canopies" (Trees).
- **Greedy Best-First**: Prioritizes distance over cost for rapid target acquisition.

### 2. Structural Breach Protocol (SBP)
When a path is mathematically unreachable, the system triggers a **Breach Scan**. This is a secondary search pass that treats walls as traversable but carries a "Critical energy cost." It identifies the **Optimal Breach Nodes** (Structural Weaknesses) required to reconnect the search graph.

### 3. Weighted Environmental Modeling
- **High-Weight Sectors (Trees)**: These represent difficult but traversable terrain. Algorithms are forced to decide between taking a longer, clear path or a shorter, high-cost path through foliage.
- **Impassable Sectors (Buildings)**: Standard walls that require the Breach Protocol to bypass.

## 🛠️ Technical Architecture
- **Frontend**: React 19 + TypeScript for high-performance state updates.
- **Layout**: Vanilla CSS with CSS Grid for precision coordinate mapping.
- **Logic**: Custom-built search implementations decoupled from the UI for computational efficiency.
- **Visuals**: Lucide-React for tactical iconography and Framer Motion for telemetry animations.

## 🧠 Engineering Challenges & Resolutions
During the development phase, several complex state and visualization issues were resolved to ensure system integrity:

### 1. Search State Persistence vs. HUD Reset
**Issue**: Initially, re-running a search would reset the drone's Backup Fuel to 100%, erasing the resource-cost implications of previous breaches.
**Resolution**: Decoupled the `resetViz` logic into two tiers: a *Tactical Reset* (clears the path visualization) and a *System Wipe* (resets fuel and grid). This ensures that energy consumption remains persistent across multiple tactical maneuvers.

### 2. Precise Tactical Reticle Anchoring
**Issue**: Tactical crosshairs used during the Breach Protocol were appearing in the screen center rather than over the specific target wall.
**Resolution**: Implemented relative positioning contexts for individual grid sectors. This allowed the absolute-positioned SVG reticles to "lock" to the precise grid coordinates, providing clear visual feedback on which structural node was being neutralized.

### 3. Asynchronous Algorithm Visualization
**Issue**: Managing the search animation while checking for failures and triggering the Breach Scan created race conditions in the status HUD.
**Resolution**: Developed a Promise-based execution wrapper for all algorithms, allowing the system to await the search result before intelligently shifting into "Breach Analysis" mode.

## ⚙️ Setup and Deployment
### Local Installation
1. Clone the repository.
2. Install dependencies: `npm install`
3. Launch tactical HUD: `npm run dev`

### Live Demo


[![Live Preview](https://img.shields.io/badge/LIVE_PREVIEW-DSSP_HUD-brightgreen?style=for-the-badge&logo=airplay)](https://dhee-s.github.io/DSSP/)

---

**Architectural Standard V2.1**  
*Optimized for Performance and Tactical Decision Making.*
