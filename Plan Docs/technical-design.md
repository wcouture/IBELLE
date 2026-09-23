# Ibelle Environmental Scientist - Technical Design Document

## 1. Overview
This project is a web-based top-down adventure game built with Phaser 3. The game combines exploration, environmental storytelling, companion-driven progression, and short mini-games set in distinct biome-inspired locations.

The core experience centers on Ibelle, a recent environmental science graduate, and Noonie, her dog companion. Players move through a small world, interact with objects, trigger mini-games, collect progress markers, and transition between scenes through a polished UI system.

## 2. Product Goals
### 2.1 Story and Narrative Goals
- Set up a compelling environmental mystery built around a county science center swallowed by a sinkhole
- Establish Ibelle as a recent graduate trying to fight misinformation and political corruption
- Introduce Dr. Sudoscience as the central antagonist who seizes power after the disaster
- Make the player feel like they are rebuilding community trust through science, outreach, and problem-solving
- Tie world exploration and mini-games to narrative progress, not just isolated rewards

### 2.2 Player Experience Goals
- Explore a cozy world with clear, readable movement and interaction flow
- Engage with low-stakes, playful environmental mini-games
- Feel a sense of progression through science points, items, and discoveries
- Experience tangibly distinct locations and adjacent activities
- Maintain smooth transitions between menu, world, and mini-game states

### 2.3 Development Goals
- Keep systems modular and reusable
- Support easy addition of new locations and interactables
- Use Phaser's native scene lifecycle for scene switching and transitions
- Separate world exploration from mini-game logic for cleaner maintenance
- Use event-driven design wherever actions can vary by object or area

## 3. Technical Stack
- Engine: Phaser 3
- Language: JavaScript
- Rendering: 2D canvas/WebGL via Phaser rendering pipeline
- UI: Phaser game objects and DOM overlays for menus and HUD elements
- Scene and input management: Phaser ScenePlugin and Keyboard input system
- Persistence: browser localStorage via SaveManager
- Asset structure: tilesets, sprites, icons, UI panels, and scene data definitions
- World generation format: per-scene data modules using 2D byte arrays

## 4. High-Level Architecture
The game uses a Phaser-native foundation instead of maintaining custom scene or input managers.

The responsibility split is:
1. Phaser owns the game loop, scene lifecycle, rendering, and keyboard input
2. Project modules own save data, progression, story state, and narrative flows
3. Scene classes handle local world logic, player movement, and scene-specific objects

This keeps the project aligned with the engine and reduces maintenance overhead caused by re-implementing core engine systems.

## 5. Game States
The game supports these primary states:

- Boot / preload
- Main menu
- Settings menu
- Save-slot selection
- World exploration
- Scene transition
- Mini-game scene
- Pause / modal state
- Story event or cutscene

Phaser scenes manage state transitions, while save and progression data live in the registry and save manager.

## 6. Scene System
### 6.1 Scene Types
- Main menu scene
- Settings scene or overlay
- World exploration scenes
- Mini-game scenes
- Transition overlay scenes

### 6.2 Scene Responsibilities
Each scene should manage:
- its own assets and tile layers
- local interactables
- player spawn position
- camera configuration
- scene-specific event hooks
- cleanup on exit

Current implementation note:
- each world scene is generated from map data modules
- map data includes at least two 2D layers: worldLayer and decorationLayer
- each byte value is a tile ID that currently maps to a color
- the same IDs are intended to map to sprite tiles in a later pass

### 6.3 World Locations
World scenes are defined as Phaser.Scene subclasses that can be added to the game config.

Worlds:
- Town Square
- Lazy Lagoon
- Funky Forest
- Sweaty Swamp
- Pleasant Plains

Current map schema:
- tileSize: number
- playerSpawnTile: { x, y }
- worldLayer: number[][]
- decorationLayer: number[][]

## 7. Input and Controller System
### 7.1 Input Model
Use Phaser's native keyboard input system and a thin project wrapper where needed. The game exposes normalized actions such as:
- moveUp
- moveDown
- moveLeft
- moveRight
- interact
- confirm
- cancel
- pause

Implementation note:
- InputManager is a lightweight wrapper over scene.input.keyboard and key codes
- no custom global DOM keyboard listeners are used

### 7.2 Keybinding Design
Input should be configurable via the settings menu.

Requirements:
- Bindings are stored in a user settings profile
- UI displays a grid of actions and currently assigned keys
- Clicking a binding starts a key capture flow
- The next key press updates the bound action
- Default keys should include WASD and arrow keys for movement, and E for interaction

### 7.3 Player Movement
Movement logic should separate directional input from the player entity itself.

The player controller should:
- read the movement state from Phaser keyboard input or a thin helper wrapper
- calculate desired velocity or direction
- apply movement against map bounds or collision constraints
- update sprite orientation or animation state
- keep movement smooth and readable

## 8. Player and Character System
### 8.1 Player Entity
The player entity is represented by a Phaser Game Object with movement and interaction logic kept separate from rendering.

Responsibilities:
- position and direction
- movement speed
- collision interaction with environment
- interaction range detection
- animation state or sprite-frame updates

### 8.2 Companion: Noonie
Noonie should be implemented as a companion layer or character reference associated with Ibelle.

Possible implementation patterns:
- a simple companion sprite that follows the player
- a companion object with state and relationship data
- a visual-only element that appears in HUD or world scenes

The design should stay flexible while preserving narrative identity.

## 9. Interaction System
### 9.1 Interactable Objects
Interactable objects should be data-driven and reusable.

Each interactable should include:
- world position
- interaction radius
- label or prompt text
- action type or callback
- optional requirements or conditions

### 9.2 Interaction Flow
When the player is within range:
- the interaction prompt appears
- pressing the interact key triggers the interactable
- the object executes its configured behavior

### 9.3 Event Model
Use an event-based or callback-based architecture so interactables can perform many actions without separate hardcoded logic branches.

Examples:
- switch scene
- launch mini-game
- trigger cutscene or dialogue
- collect item
- unlock companion or quest flag

## 10. HUD and UI Design
### 10.1 HUD Requirements
The HUD should remain persistent and readable during exploration scenes.

Content includes:
- science points
- collected items
- companions or unlocks
- mini-game progression summary if relevant

### 10.2 Transition Overlay
The transition controller should cover the screen and animate between scenes.

Flow:
1. Trigger transition
2. Display overlay panel
3. Load or swap scene data
4. Fade or slide overlay away
5. Resume gameplay

## 11. Save and Progression System
### 11.1 Story Progression Model
The save state should include narrative progression in addition to gameplay stats.

Core narrative systems:
- sinkhole disaster state
- county authority takeover by Dr. Sudoscience
- community trust meter
- scientific knowledge meter
- completed outreach tasks
- discovered evidence or puzzle solutions

### 11.2 Save Data Model
Each save slot should store:
- slot metadata
- current world/scene
- player position
- inventory or collected items
- science points
- completed quests
- story flags
- explored locations
- save timestamp

## 12. Narrative and Cutscene System
### 12.1 Cutscene Manager
Responsibilities:
- execute a queued sequence of actions for story events or scripted encounters
- run actions in series using async/await or event-based completion
- pause or skip cutscene flow when player input is triggered
- restore control to the player once the sequence ends

### 12.2 Text Scroller
Responsibilities:
- reveal text character by character in a text panel
- support the typewriter effect for dialogue and narrative text
- expose completion and skip signals

### 12.3 Narrative Trigger
Responsibilities:
- encapsulate story triggers tied to object interactions, scene loads, or quest conditions
- invoke a cutscene sequence when the player meets certain criteria

## 13. Mini-Game Architecture
### 13.1 Mini-game Manager
Responsibilities:
- register available mini-games
- open a specific mini-game by ID
- return to the world scene after completion
- pass reward data back to progression systems

### 13.2 Base Mini-game Scene
Responsibilities:
- common lifecycle for mini-game scenes
- start, complete, fail, and exit behaviors
- local HUD and state management

## 14. Suggested Module Relationships
- GameBootstrap initializes Phaser and assigns managers to the registry
- Phaser scene system loads world and mini-game scenes
- World scenes contain local interactables and player movement logic
- Player movement reads from InputManager and Phaser keyboard state
- InteractableManager calls action handlers or emits events
- EventDispatcher notifies ProgressionManager, SaveManager, and HUDController
- HUDController reads state from ProgressionManager and InventoryManager
- SaveManager persists the same progression data that HUDController displays

## 15. Design Principles
- Separate scenes from gameplay logic
- Keep managers responsible for system coordination
- Keep world data separate from behavior logic
- Favor reusable components over one-off implementations
- Make interactions extensible through callback or event patterns
- Keep progression state centralized and persistent
- Use Phaser's first-party systems instead of re-implementing engine features

## 16. Summary
The architecture is designed to support a cozy exploration game with modular, data-driven systems. Phaser handles the core game loop, scene creation, and keyboard input, while custom project systems focus on progression, save data, story flow, and reusable interactables. This keeps the implementation aligned with the engine and avoids re-building features that Phaser already provides.
