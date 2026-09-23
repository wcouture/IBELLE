# IBELLE — Environmental Scientist

A browser-based exploration game prototype where players control **Ibelle**, an environmental science graduate, as she explores a stylized world, gathers knowledge, and advances community science awareness.

This repository currently contains an early vertical-slice foundation with:
- a Phaser-powered game bootstrap
- a main menu scene
- two explorable world scenes (Town Square and Lazy Lagoon)
- keyboard movement and interaction input abstraction
- local save-slot storage (3 slots)
- data-driven tile-map rendering from 2D layer arrays

---

## Table of Contents
- [Project Status](#project-status)
- [Core Gameplay Loop (Current Build)](#core-gameplay-loop-current-build)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Architecture Overview](#architecture-overview)
- [Scenes and World Data](#scenes-and-world-data)
- [Save System](#save-system)
- [Input and Controls](#input-and-controls)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Development Notes](#development-notes)
- [Roadmap Context](#roadmap-context)
- [Troubleshooting](#troubleshooting)

---

## Project Status

This is an **in-progress prototype** focused on proving the core framework:
- scene bootstrapping
- map rendering
- menu flow
- movement
- simple scene switching
- persistence scaffolding

Several larger systems described in planning docs (cutscenes, minigames, richer progression, antagonist systems, expanded locations) are not fully implemented yet.

---

## Core Gameplay Loop (Current Build)

1. Launch into `MainMenu`.
2. Choose **Start Game** to create a save in the first unused slot (or slot 1 if all are used).
3. Enter **Town Square**.
4. Move the player rectangle with keyboard controls.
5. Use scene-switch buttons to move between **Town Square** and **Lazy Lagoon**.
6. Return to menu and use **Load Game** to load the first available used save.

---

## Technology Stack

- **Language:** JavaScript (ES Modules)
- **Engine/Framework:** Phaser (installed package version: `^4.2.1`)
- **Build Tool / Dev Server:** Vite (`^8.3.0`)
- **Persistence:** Browser `localStorage`
- **Styling:** CSS (global app styling + planned UI utility classes)

---

## Repository Structure

```text
IBELLE/
├── index.html
├── package.json
├── vite.config.js
├── Src/
│   ├── main.js
│   ├── styles.css
│   ├── core/
│   │   ├── GameBootstrap.js
│   │   ├── InputManager.js
│   │   ├── SaveManager.js
│   │   └── UIManager.js
│   ├── scenes/
│   │   ├── MainMenuScene.js
│   │   ├── TownSquareScene.js
│   │   └── LazyLagoonScene.js
│   └── world/
│       ├── renderWorldMap.js
│       ├── tilePalette.js
│       └── maps/
│           ├── townSquareMap.js
│           └── lazyLagoonMap.js
└── Plan Docs/
    ├── technical-design.md
    ├── architecture-outline.md
    ├── implementation-backlog.md
    └── plan.md
```

---

## Architecture Overview

### `GameBootstrap`
- Creates the Phaser game instance.
- Registers scenes:
  - `MainMenuScene`
  - `TownSquareScene`
  - `LazyLagoonScene`
- Injects shared services through Phaser registry:
  - `saveManager`
  - `inputManager`
  - `activeSave`

### `InputManager`
- Provides reusable action bindings (`up`, `down`, `left`, `right`, `interact`).
- Returns normalized movement vectors for smooth diagonal movement.
- Stores per-scene key maps.

### `SaveManager`
- Uses `localStorage` key: `ibelle-environmental-scientist-saves`.
- Maintains 3 save slots.
- Creates save state with:
  - scene
  - science points
  - knowledge meter
  - inventory
  - companions
  - creation timestamp

### `UIManager`
- Lightweight helper for Phaser text labels/buttons.
- Standardizes visual styling and click behavior for scene UI elements.

---

## Scenes and World Data

### Main Menu (`MainMenuScene`)
- Start Game: creates a new save and launches Town Square.
- Load Game: loads first existing used save.
- Settings: placeholder message (not implemented).

### Town Square (`TownSquareScene`)
- Renders map from `townSquareMap` via `renderWorldMap`.
- Spawns a controllable player rectangle.
- Displays basic HUD labels and scene switch controls.

### Lazy Lagoon (`LazyLagoonScene`)
- Renders map from `lazyLagoonMap`.
- Uses same movement/update pattern as Town Square.
- Provides scene switch button back to Town Square.

### World Rendering (`renderWorldMap`)
- Validates world/decoration layer dimensions.
- Draws tile rectangles based on numeric tile IDs and palette mapping.
- Computes map bounds and player spawn point.
- Uses fallback magenta for unknown tile IDs.

### Tile Layers
Each map exports:
- `tileSize`
- `playerSpawnTile`
- `worldLayer` (2D array)
- `decorationLayer` (2D array)

---

## Save System

Save slots are arrays of:
- `id`
- `used`
- `timestamp`
- `state`

Default `state` fields created on new game:
- `scene: "TownSquare"`
- `sciencePoints: 0`
- `knowledgeMeter: 0`
- `inventory: []`
- `companions: ["Noonie"]`
- `createdAt: <epoch ms>`

---

## Input and Controls

Default controls:
- `W` / `A` / `S` / `D` for movement
- `E` for interaction (action key is defined, interaction systems are still early)

Movement is normalized to keep diagonal speed consistent.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install
```bash
npm install
```

### Run locally
```bash
npm run dev
```
Then open the local Vite URL shown in your terminal.

### Production build
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

---

## Available Scripts

From `package.json`:
- `npm run dev` — start development server
- `npm run build` — create production build
- `npm run preview` — preview production build
- `npm test` — placeholder script (currently exits with error)

---

## Development Notes

- Source code currently lives under `Src/` (capital **S**).
- The game currently uses primitive rectangle placeholders for player and map tiles.
- `styles.css` includes richer UI class definitions that can support expanded DOM/overlay UI work.
- Planning and architecture docs live under `Plan Docs/` and describe intended future systems.

---

## Roadmap Context

Based on planning docs, expected next major areas include:
- expanded world locations
- richer HUD and settings UI
- story/cutscene framework
- mini-game framework and gameplay loops
- broader progression and antagonist pressure systems
- polish and playtesting passes

See:
- `Plan Docs/technical-design.md`
- `Plan Docs/architecture-outline.md`
- `Plan Docs/implementation-backlog.md`

---

## Troubleshooting

### Blank screen or module not found on case-sensitive systems
If your environment is case-sensitive, verify import paths and directory naming are aligned (`Src` vs `src`) across entry references and module imports.

### Saves not loading as expected
- Open browser dev tools and inspect localStorage key:
  - `ibelle-environmental-scientist-saves`
- Clear localStorage if old incompatible data exists.

### Build errors after dependency updates
- Remove `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

---

## License

The repository currently lists `ISC` in `package.json`.
