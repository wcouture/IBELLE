# Ibelle Environmental Scientist - Game Specification

## 1. Project Overview
This project is a top-down, pixel-art adventure game built with Phaser 3. The game centers on Ibelle, a recent environmental science graduate, and her dog Noonie as they explore a small world of locations, mini-games, and environmental discovery.

### 1.1 Story Context
- Ibelle just graduated about to start part-time job with county environmental science center for summer
- Massive sinkhole opens up underneath the county science center swallowing it whole
- All local scientists and scientific knowledge lost
- Dr sudoscience given complete authority over county and cancels scientific programs
- Ibelle begins working for lobbyist firm to try and fight dr sudoscience's push to destroy the land

### 1.2 Broad Objectives
- Travel between world locations playing mini-games and complete puzzles
- mini-games reward user with science points
- science points can be spent on community outreach, scientific studies, and advertising campaigns
- each event bought with science points fills a community knowledge meter
    * once meter full, dr sudoscience can't lie to the people anymore and is overthrown
- user can search for items to complete puzzles as well
    * puzzles reward with science points or collectibles

## 2. Technical & Art Direction
### 2.1 Engine and Presentation
- Built using Phaser 3 for a 2D pixel-art web game experience
- Top-down camera with tile-based world scenes
- Pixel-art aesthetic inspired by cozy farming and exploration games
- Scenes should feel warm, playful, and readable while maintaining a polished game feel
- Phaser 3 is preferred because it is purpose-built for 2D sprite-based games and supports scene management, UI, and input more directly than a 3D engine

### 2.2 Visual Style Goals
- Cozy, colorful world with distinct biome-based locations
- Clear readability for player movement, NPCs, and interactables
- Custom tile sets for each world area
- Scene transitions with smooth UI overlays and animation

## 3. Core Characters
### 3.1 Ibelle
- Main playable character
- Recent graduate in environmental science
- Player-controlled explorer and problem-solver
- Serves as the lens through which the world and side activities are experienced

### 3.2 Noonie
- Black-and-white spotted cattle dog
- Closest companion to Ibelle
- Strong bond with the player character
- Can be represented as a companion, persistent character, or visual companion element depending on implementation

### 3.3 Dr. Sudoscience
- Main antognist
- Assumes power over county after sink hole disaster
- Doesn't believe in environmental science and wants to develop everything

## 4. Game Structure & Scene Flow
### 4.1 Main Menu
- Buttons for Start Game, Load Game, and Settings
- Start Game opens save-slot selection for a new campaign save
- Load Game opens save-slot selection for continuing an existing save
- Settings opens the settings menu

### 4.2 Settings Menu
- Volume slider
- Keybinding configuration
- Grid-based list of actions and assigned keys
- Each action can be rebound by pressing a new key
- Controls should support common movement and interaction actions such as:
  - move up
  - move down
  - move left
  - move right
  - interact
  - action/confirm
  - pause/menu access if needed

### 4.3 World Locations
Each location is a custom scene built from tilesets and populated with interactable objects.

- Town Square
- Lazy Lagoon
- Funky Forest
- Sweaty Swamp
- Pleasant Plains

### 4.4 Mini-Games
Mini-games are self-contained scenes with visual themes inspired by the world area they belong to.

- Bird Call Simon
- Fishing Derby
- Bear Control
- Surveyor

## 5. Player Control System
### 5.1 Player Entity
- Player is rendered in world scenes as a character sprite
- Controlled by the player in real time while walking around the environment
- Supports standard movement input using WASD and/or arrow keys

### 5.2 Interaction System
- Press E to interact with nearby world objects when in range
- When within interaction distance, an on-screen prompt appears: "Press E to interact"
- Interaction logic is based on proximity and object-specific behavior
- Interactor should support multiple action types through event-driven handlers

## 6. World Interaction & Object Systems
### 6.1 Interactables
Interactables are reusable objects that can be placed in world-scene maps.

- Each interactable has a defined interaction radius
- Player can activate the interactable when within range
- Activation raises an event to a handler for custom game logic
- This allows for flexible object behavior without hardcoding every interaction

### 6.2 Example Interactable: SceneSwitcher
- Programmatically assigned destination scene
- On interaction, trigger the transition controller
- Perform scene switch after the transition animation begins or completes
- Enables easy world navigation and area-to-area movement

### 6.3 Event-Driven Design
- Interactable objects should not be limited to one specific behavior
- Each object can map to custom callbacks or logic handlers
- Example behaviors include:
  - opening a minigame
  - starting a dialogue/event
  - moving to another location
  - triggering environmental puzzle logic

## 7. Scene Transition & UI Systems
### 7.1 Transition Controller
- Manages animations and timing for scene switching
- Slides a panel over the screen before scene load
- Slides panel away after the new scene is ready
- Keeps transitions smooth and consistent across world transitions and menu flow

### 7.2 HUD / Player Interface
The HUD provides persistent gameplay information and a strong sense of progress.

- Science points earned from mini-games
- Items collected by the player
- Companions or allies encountered
- Relevant status data for current world or objective progression

## 8. Progression & Save Systems
### 8.1 Save/Load Flow
- New game creates a save slot and begins progression from a fresh state
- Load game chooses a slot and restores saved state
- Save data should include progress relevant to player location, unlocked content, and collected stats

### 8.2 Progression Data
- Science points
- Collected items
- Unlocked companions or teams
- Completed mini-games or milestones
- Potential world-state flags for event progression

## 9. Proposed Systems Architecture
To keep the codebase organized, the project can be split into a few core systems:

### 9.1 Core Systems
- Game bootstrap and scene manager
- Input manager and keybinding system
    - Allows for easy keybinding to individual
- Player controller and movement logic
    - WASD or arrow keys for player movement
    - E for interacting
- Interaction manager and interactable registry
- UI/HUD controller
- Save/load manager
- World scene definitions and transition system
    - Worlds defined by multiple 2D arrays of Tile IDs
    - Tile ID corresponds to a particular tile
    - Multiple layers allow for interactable tiles to be placed on top of scene tiles
- Mini-game system and event handlers

### 9.2 Design Principles
- Keep systems modular and reusable
- Use event-driven interactions for flexibility
- Separate world scenes from mini-game scenes
- Treat each location as its own scene composition with custom objects and triggers
- Maintain consistent transition behavior between all major state changes

## 10. Cutscene & Dialogue System
### 10.1 Cutscene Overview
Cutscenes are structured as asynchronous sequences of actions that play out over time. Each action resolves via a promise, allowing scenes to chain movement, text display, camera shifts, sound cues, UI transitions, and event triggers in a deterministic order.

### 10.2 Core Cutscene Pattern
Cutscene sequences should be built as a list of actions executed one after another.

Examples of cutscene actions:
- wait for a duration
- move the player to a target position
- move an NPC to a target position
- face a character toward a direction
- trigger a world event or object state change
- fade in/out the screen or UI
- display dialogue text in a text box
- pause until the player advances the dialogue

### 10.3 Promise-Driven Execution
Each action in a cutscene should return a promise that resolves when the action completes. This allows the cutscene system to compose one action after another using async/await patterns.

Example flow:
- Ibelle walks to the town square
- a camera pans toward the science center ruins
- a text-scroller displays a line of dialogue
- Noonie moves closer to Ibelle
- the scene ends and returns control to the player

### 10.4 Text Scroller
The text scroller is a dialogue UI component that reveals text character by character over time.

Requirements:
- text appears one character at a time in a panel or dialogue box
- optional voice/sound effect can play per character or per sentence
- dialogue can advance on space, enter, or click
- supports skipping to the end of the current line if the player presses a confirm action
- supports multiple lines or a scrolling text box for longer narrative beats

### 10.5 Example Story Sequence
- Player begins in Town Square
- cutscene triggers after interacting with the broken science center gate
- Ibelle walks toward the ruined structure
- text panel displays: "The science center is gone... but the truth isn't."
- Dr. Sudoscience appears in the distance and the camera shifts
- a second text panel reveals a warning about the county takeover
- control returns to the player after the scene completes

## 11. Overall Experience Goal
The game should feel like a cozy, exploration-driven environmental adventure where players wander through distinct world areas, complete playful mini-games, collect science-related progress, and build a sense of place through movement, discovery, and companion-driven storytelling. The cutscene system should support the larger story arc by letting narrative beats unfold naturally as the player explores and pushes against Dr. Sudoscience's misinformation campaign.
