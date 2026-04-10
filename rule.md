# DSSP Tactical Rules & Intelligence Logic Matrix (V8.0)

This document outlines the core algorithmic architecture, evolutionary deployment rules, and tactical visualization protocols for the **Drone Strategic Search Platform (DSSP)**.

---

## 1. Evolutionary Deployment Rules (V8.0)

Environmental objects (Buildings & Trees) now utilize a stage-based growth system with strict mutual exclusivity.

### A. Urban Growth (Buildings)
- **Status**: Absolute traversal obstacle (No-Fly Zone).
- **Deployment Logic**:
    - **Stage 1 (Click 1)**: Primary unit deployment. Single structural block.
    - **Stage 2 (Click 2)**: Cluster expansion. Places **2-3 additional random buildings** in the 3x3 surrounding radius. (Bypasses existing trees).
    - **Stage 3 (Click 3)**: Saturation. Adds another **2-3 random buildings**, creating dense cover.
    - **Stage 4 (Click 4)**: Tactical Wipe. Clears all buildings in the 3x3 sector area.
- **Mutual Exclusion**: Buildings cannot be placed on Trees. Placing a building on a tree node will clear the biological data first.

### B. Biological Growth (Trees/Forests)
- **Status**: Passable terrain with variable drag (Weight).
- **Evolutionary Stages**:
    - **Stage 1**: Small Tree. **Weight: 5**.
    - **Stage 2**: Medium Tree. **Weight: 20**.
    - **Stage 3**: Large Tree. **Weight: 50**.
    - **Stage 4**: Reset. Sector restored to unit cost (1).

---

### AI ADAPTIVE PROTOCOLS (DSSP V2.1)

#### **0x09: BACKUP FUEL SYSTEM**
- **Purpose**: Power reserve for overcoming high-drag or structural obstacles.
- **Consumption Rate (Eco)**: 5% per sector in ECO CANOPY.
- **Consumption Rate (Breach)**: 40% per structural unit neutralized.
- **Fail State**: If backup fuel <= 0%, the aerial unit enters KINETIC LOCK.

#### **0x10: STRUCTURAL BREACH**
- **Trigger**: Activated when zero valid trajectories exist to the SOS coordinates.
- **Action**: AI calculates the structural "weakest link" and performs a precision demolition.
- **Note**: Requires minimum 40% Backup Fuel to execute.
- **Mutual Exclusion**: Trees cannot be planted on Buildings. The urban structure must be cleared (demolished) first.

---

## 2. Pathfinding Intelligence (Tactical Overdrive)

The HUD signals environmental interaction through dynamic color-mapping and opacity persistence.

### A. Neon Cyan "Overdrive" State
- **Trigger**: When the active search vector (final path) intersects a **Tree** sector.
- **Visual**: The path glow shifts from Tactical Red to **Vibrant Cyan (#00f2ff)**.

### B. Search Persistence (Exploration Phase)
- **Logic**: During the Algorithmic Exploration phase, forest icons remain visible at **20% opacity** even when covered by the "Explored" (Purple) or "Frontier" (Gold) HUD overlays.
- **Benefit**: Allows the operator to maintain awareness of organic resistance zones while the drone evaluates trajectories.

---

## 3. Algorithmic Hierarchy
- **A* OPTIMA**: Balanced heuristic using Manhattan distance + terrain weights.
- **UCS SECURE**: Pure Dijkstra logic prioritizing the absolute lowest weighted cost.
- **GREEDY FAST**: Direct-to-target logic ignoring weights.

---

## 4. Geometric Constraints & Mission Data
- **Grid Resolution**: 24x16 Tactical Matrix.
- **Mission Presets**: High-fidelity environments now include balanced distributions of **Urban Walls** and **Density Forests** (Delta, High-Hard, Training).
- **Tooling**: Modular sidebar with dynamic telemetry feedback.

---

## 5. Tactical Comparison Protocol (New in V8.0)

DSSP V8.0 introduces the ability to benchmark multiple algorithms against the same environmental configuration.

### A. Batch Execution
- **Activation**: Toggle "COMPARISON MODE" in the Sidebar.
- **Selection**: Select 2 or more algorithms (A*, BFS, etc.).
- **Workflow**: Click RUN to start a sequential sweep. The system will hold a 800ms pause between missions for data stability.

### B. Analytical Reports
- **Metrics**: Post-mission HUD displays comparative Time (Latency), Path Units (Trajectory Length), and Sweep Area (Nodes Explored).
- **Winner Detection**: The system identifies and badges the "Optimal" approach in each tactical category.

---

*Document ID: DSSP-RULE-V8.0 // Strategic Benchmark Protocol*
