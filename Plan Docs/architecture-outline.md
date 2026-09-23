# Ibelle Environmental Scientist - Class and System Architecture Outline

## 1. Architecture Goal
The game should use a modular architecture where gameplay systems remain independent while Phaser 3 handles rendering, scene lifecycle, and input. This keeps the code easier to maintain and allows future map, character, and mini-game additions without rewriting core engine behavior.

## 2. High-Level System Breakdown

### 2.1 Core Game Systems
- GameBootstrap ✅
- InputManager (thin Phaser wrapper) ✅
- SaveManager ✅
- SpriteAnimationHandler ✅
- Actions (tile interaction action definitions) ✅
- ResourceLoader *(planned)*
- AudioManager *(planned)*

### 2.2 World and Entity Systems
- Phaser Scene classes for each world ✅ (TownSquare, LazyLagoon)
- TileMap / renderWorldMap ✅
- TilePalette ✅
- PlayerController ✅ (inline in world scenes)
- CharacterEntity *(planned — currently inlined)*
- CompanionSystem *(planned)*
- InteractableManager ✅ (implemented as `checkInteractiveTiles` inside `renderWorldMap`)
- InteractionPromptController ✅ (prompt labels via UIManager in each scene)

### 2.3 UI Systems
- UIManager ✅
- GameSceneHUD ✅ (science points, knowledge meter, world name)
- MenuController ✅ (MainMenuScene)
- SettingsController *(planned)*
- TransitionController *(planned — current step)*
- SaveSlotUI *(planned)*

### 2.4 Gameplay Systems
- ProgressionManager *(planned)*
- InventoryManager *(planned)*
- MinigameManager *(planned)*
- RewardSystem *(planned)*
- EventDispatcher *(planned)*
- StoryManager *(planned)*
- CommunityKnowledgeMeter *(planned)*
- AntagonistController *(planned)*
- CutsceneManager *(planned)*
- DialogueBoxController *(planned)*
- TextScroller *(planned)*

## 3. Story and Antagonist Structure

### StoryManager
Responsibilities:
- track main narrative state
- hold story flags related to the sinkhole disaster and Dr. Sudoscience takeover
- unlock story beats as players complete events and puzzle objectives
- update the main campaign progression state

Key story data:
- sinkholeOccurred
- scienceCenterDestroyed
- drSudoscienceInPower
- communityAwarenessLevel
- narrativeObjectivesCompleted

### AntagonistController
Responsibilities:
- represent Dr. Sudoscience as a persistent narrative threat
- track his influence over the county and public perception
- trigger narrative pressure points when the player fails or stalls
- react to the community knowledge meter reaching critical values

### CommunityKnowledgeMeter
Responsibilities:
- measure how much of the public believes in science and environmental truth
- increase through successful outreach, research, and evidence gathering
- decrease when misinformation spreads or certain story events are mishandled
- serve as the main progression win-state for the campaign

## 4. Cutscene and Narrative Systems

### CutsceneManager
Responsibilities:
- execute a queued sequence of actions for story events or scripted encounters
- run actions in series using async/await or event-based completion
- pause or skip cutscene flow when player input is triggered
- restore control to the player once the sequence ends

### DialogueBoxController
Responsibilities:
- hold the dialogue panel and current speaker metadata
- display dialogue text from the active cutscene or story event
- manage skip/advance state and closing the box

### TextScroller
Responsibilities:
- reveal text character by character in a text panel
- support the typewriter effect for dialogue and narrative text
- expose completion and skip signals

### NarrativeTrigger
Responsibilities:
- encapsulate story triggers tied to object interactions, scene loads, or quest conditions
- invoke a cutscene sequence when the player meets certain criteria

## 5. Main Classes / Modules

### GameBootstrap
Responsibilities:
- initialize the Phaser game instance and renderer
- load configuration and assets
- register scene classes and global registry values
- set up save and progression state

Dependencies:
- InputManager
- SaveManager
- ResourceLoader

Current implementation:
- creates a 1280x720 Phaser game with pixel-art rendering, arcade physics, and FIT scale mode
- registers `saveManager` and `inputManager` in the game registry
- registers `MainMenuScene`, `TownSquareScene`, and `LazyLagoonScene`

### Phaser Scene System
Responsibilities:
- manage the active scene
- switch scenes and overlays using Phaser's native ScenePlugin
- allow world scenes and mini-game scenes to be registered in the game config
- coordinate scene cleanup and setup through the engine lifecycle

This project does not maintain a custom scene manager. Phaser handles scene transitions and lifecycle events directly.

### InputManager
Responsibilities:
- provide a thin abstraction over Phaser keyboard input
- map keys to normalized actions for gameplay systems
- support settings-driven rebinding without duplicating Phaser input internals

Key concepts:
- key bindings stored as Phaser key codes
- action checks resolved via scene.input.keyboard
- helpers for movement and interaction state

Current implementation:
- default bindings: W/A/S/D for movement, E for interact
- `getKeyMap(scene)` creates and caches per-scene key maps, cleaned up on scene SHUTDOWN and DESTROY
- `getMovementVector(scene)` returns a normalized `{x, y}` vector
- `isDown(scene, action)` and `wasPressed(scene, action)` check per-scene action state
- rebinding UI is not yet implemented

### SaveManager
Responsibilities:
- create, load, and save slot data
- validate save versioning
- restore scene state and progression

Save structure:
- slotId
- timestamp
- playerPosition
- inventory
- stats
- completedMinigames
- unlockedCompanions
- worldFlags

Current implementation:
- persists exactly three save slots under localStorage key `ibelle-environmental-scientist-saves`
- each slot stores: `scene`, `sciencePoints`, `knowledgeMeter`, `inventory`, `companions`, `createdAt`
- `createSave(slotIndex, initialState)` populates a slot with defaults and writes to storage
- `loadSave(slotIndex)` returns the state object for a slot
- `loadAll()` returns all three slots, merging stored values over the default shape
- Noonie is included as the default companion in every new save

### ResourceLoader
Responsibilities:
- load textures, sprite sheets, tilesets, UI assets, and data files
- track asset readiness
- provide asset retrieval for scenes and entities

## 6. Entity and World Classes

### CharacterEntity
Responsibilities:
- represent a character in the world
- contain position, velocity, facing direction, and sprite data
- support movement-related state updates

Properties:
- id
- name
- position
- velocity
- sprite
- collisionBox
- facingDirection

### PlayerController
Responsibilities:
- resolve player movement input
- update player position and animation
- enforce movement constraints
- trigger interaction checks

Dependencies:
- InputManager
- CharacterEntity
- World scene instance
- InteractableManager

### CompanionSystem
Responsibilities:
- handle Noonie or other companion behavior
- manage companion state and relationship data
- optionally attach the companion to the player or world space

### WorldScene
Responsibilities:
- represent a location with tile data and scene objects
- contain interactables and triggers
- manage spawn points and world-specific logic
- initialize and remove scene-specific resources

In this project, each world is implemented as a Phaser.Scene subclass such as TownSquareScene or LazyLagoonScene rather than a custom world controller class.

Currently implemented worlds:
- `TownSquareScene` — loaded from `townSquareMap.js`, 250x250 tiles, player spawns at map center
- `LazyLagoonScene` — loaded from `lazyLagoonMap.js`, 250x250 tiles

Pending worlds (Phase 5): Funky Forest, Sweaty Swamp, Pleasant Plains

### TileMap
Responsibilities:
- store tile grids as 2D byte arrays
- render tile visuals from tile IDs
- support at least two layers per scene: worldLayer and decorationLayer

Current format:
- tileSize: number
- playerSpawnTile: { x, y }
- worldLayer: number[][]
- decorationLayer: number[][]

Current rendering behavior:
- tile IDs map to sprite textures through `TILE_COLLECTION` in `tilePalette.js`
- tile colors in `TILE_COLOR_PALETTE` are still defined but sprite textures are the active rendering path
- unknown IDs render a fallback debug color
- scene bounds and spawn point are derived from map dimensions and spawn tile
- `renderWorldMap` supports viewport culling via `refreshVisibleTiles` with an overscan buffer

### SpriteAnimationHandler
Responsibilities:
- preload sprite sheet frames from tile sprite asset files
- create named animation configurations in a Phaser scene
- play or switch animations on a game object with playback rate control
- prevent redundant animation restarts when the same animation is already active

### Actions
Responsibilities:
- define the set of named tile interaction actions that can be assigned to tiles in `tilePalette.js`
- each action has an `id` and a `name`

Current defined actions:
- SHAKE (id: 0)
- PICK (id: 1)
- READ (id: 2)
- RIPPLE (id: 3)

## 7. Interaction System Architecture

### Interactable
Base interface or class for every interactive object.

Common members:
- id
- position
- interactionRadius
- promptText
- isActive
- onInteract()

### InteractableManager
Responsibilities:
- keep a registry of interactables in the active scene
- detect nearby interactables based on player distance
- manage the active interaction target
- raise events or invoke callbacks

### InteractionPromptController
Responsibilities:
- display prompt text when the player is in range
- determine whether interaction can occur
- hide prompt when range is exited

## 8. UI and HUD Architecture

### HUDController
Responsibilities:
- display persistent gameplay info
- update science points, item count, and companions
- reflect active scene or mission state
- display active narrative objectives and community knowledge meter

Current implementation:
- `GameSceneHUD` satisfies the core HUD role
- displays: world name (top-left), science points, and knowledge meter percentage
- inventory, companions, objectives, and full knowledge meter detail not yet implemented

### MenuController
Responsibilities:
- render main menu buttons
- handle Start, Load, and Settings actions
- trigger menu transitions

### SettingsController
Responsibilities:
- manage audio settings
- manage keybinding UI and capture flow
- update configuration data and persist it

### TransitionController
Responsibilities:
- animate the visual transition overlay
- coordinate timing before and after scene change
- hide the overlay once the scene has loaded

## 9. Progression and Save Architecture

### ProgressionManager
Responsibilities:
- store current progression state
- update science points, inventory, companions, and flags
- track completed tasks and milestones
- connect story progression to the community knowledge meter and antagonist state

### InventoryManager
Responsibilities:
- manage all collected items and resources
- update item counts and unlock states
- provide functions for pickup, use, or comparison

### RewardSystem
Responsibilities:
- standardize rewards earned from mini-games or world events
- emit reward objects that can be processed by progression systems
- include narrative rewards, community trust gains, and evidence discoveries

## 10. Mini-Game Architecture

### MinigameManager
Responsibilities:
- register available mini-games
- open a specific minigame by ID
- return to the world scene after completion
- pass reward data back to progression systems

### BaseMinigameScene
Responsibilities:
- common lifecycle for mini-game scenes
- start, complete, fail, and exit behaviors
- local HUD and state management

### Mini-game Specific Classes
Examples:
- BirdCallSimonGame
- FishingDerbyGame
- BearControlGame
- SurveyorGame

These classes inherit or follow the same scene lifecycle pattern while implementing their own rules and UX.

## 11. Event Architecture
A lightweight event-driven layer is recommended for object interactions and cross-system communication.

Examples:
- PlayerInteractionEvent
- SceneTransitionEvent
- MinigameCompletedEvent
- ItemCollectedEvent
- SaveLoadedEvent

This reduces direct dependencies between unrelated systems and keeps interactions flexible.

## 12. Data Model Outline

### World Data
- sceneId
- tileSetName
- width, height
- tileSize
- playerSpawnTile
- worldLayer[][]
- decorationLayer[][]
- tilePaletteRef
- spawnPoint
- interactables[]
- backgroundLayers[]

### Interactable Data
- id
- type
- position
- radius
- prompt
- targetSceneId or callbackRef
- requiredFlags[]

### Progression Data
- sciencePoints
- inventory[]
- companions[]
- unlockedAreas[]
- completedMiniGames[]
- storyFlags[]

## 13. Suggested Module Relationships
- GameBootstrap creates the Phaser game and assigns InputManager and SaveManager to the registry
- Phaser scene system loads world and mini-game scenes
- World scenes contain interactables and player movement logic
- Player movement reads from InputManager and Phaser keyboard state
- InteractableManager calls action handlers or emits events
- EventDispatcher notifies ProgressionManager, SaveManager, and HUDController
- HUDController reads state from ProgressionManager and InventoryManager
- SaveManager persists the same progression data that HUDController displays

## 14. Design Principles
- Separate scenes from gameplay logic
- Keep managers responsible for system coordination
- Keep world data separate from behavior logic
- Favor reusable components over one-off implementations
- Make interactions extensible through callback or event patterns
- Keep progression state centralized and persistent
- Use Phaser's built-in systems instead of re-implementing engine features

## 15. Summary
The architecture is designed to support a cozy exploration game with modular, data-driven systems. Phaser handles the core game loop, scene creation, and keyboard input, while custom project systems focus on progression, save data, story flow, and reusable interactables. This keeps the implementation aligned with the engine and avoids rebuilding functionality that already exists inside Phaser.
