# Ibelle Environmental Scientist - Implementation Backlog

## 1. Project Goal
Build the first playable version of the game as a cozy exploration game in a Phaser 3 web app. The MVP should include a main menu, save-slot flow, world exploration, core movement, interaction prompts, a transition system, and at least one mini-game loop tied to progression.

## 2. MVP Definition
Before expanding into all locations and content, the project should reach a playable baseline:

- Start game flow works
- Save and load system works for at least 3 slots
- Player can move in a world scene
- Interactables trigger scene changes or events
- Transition overlay works between scenes
- HUD displays persistent player progression
- At least one mini-game can be launched and completed
- At least one full world scene is playable
- Narrative state and antagonist pressure can be tracked through the campaign
- Community knowledge meter is visible and can be increased through gameplay actions

## 3. Backlog Structure

### Phase 1: Foundation and Tooling ✅ COMPLETE
Priority: Must have

#### 1. Project Setup ✅ DONE
- Create project structure for the web game
- Set up package manager and build tooling
- Configure development scripts for local run and production build
- Add directory structure for scenes, systems, entities, UI, data, and saves
- Acceptance criteria:
  - project runs locally
  - developer can launch a blank scene and see output

#### 2. Phaser 3 Bootstrap ✅ DONE
- Create a Phaser-based game bootstrap
- Initialize the game config and main scene flow
- Add a basic game loop and resize handling
- Acceptance criteria:
  - a blank or placeholder scene renders successfully
  - app updates each frame without errors
- Implementation notes:
  - `GameBootstrap` creates the Phaser game instance and registers `SaveManager` and `InputManager` to the game registry
  - 1280x720 with pixel-art rendering, arcade physics, and FIT scale mode

#### 3. UI and HUD in Phaser Scenes ✅ DONE
- Build menu, HUD, and overlays using Phaser scene UI objects
- Keep overlay/panel behavior consistent across scenes
- Acceptance criteria:
  - UI elements render correctly in Phaser scenes
  - layout is stable across screen sizes
- Implementation notes:
  - `UIManager` provides `addLabel`, `addButton`, and `removeLabel` helpers using Phaser game objects
  - `GameSceneHUD` wraps UIManager and exposes `setWorld`, `setSciencePoints`, and `setKnowledge` methods

#### 4. Phaser Scene Flow and Registry State ✅ DONE
- Use Phaser ScenePlugin for scene transitions and lifecycle
- Use game registry + save systems for shared game state
- Acceptance criteria:
  - scenes can be switched cleanly
  - state shared through registry and save systems remains consistent
- Implementation notes:
  - Scenes registered: `MainMenuScene`, `TownSquareScene`, `LazyLagoonScene`
  - `activeSave`, `saveManager`, and `inputManager` are stored in the game registry

#### 5. Save Data Model ✅ DONE
- Define save-file structure
- Add save slot metadata
- Build a save/load API for browser localStorage or equivalent
- Acceptance criteria:
  - save slots can be created and loaded
  - save state persists after refresh or reload
- Implementation notes:
  - `SaveManager` persists three save slots under `localStorage` key `ibelle-environmental-scientist-saves`
  - Each slot stores: `scene`, `sciencePoints`, `knowledgeMeter`, `inventory`, `companions`, `createdAt`
  - Default state includes Noonie as the first companion

---

### Phase 2: Core Gameplay Systems ✅ COMPLETE
Priority: Must have

#### 6. Input Manager and Keybinding System ✅ DONE
- Wrap Phaser keyboard input for normalized actions
- Define action names for movement and interaction
- Default keys:
  - WASD for movement
  - E for interaction
- Acceptance criteria:
  - movement responds to configured keys
- Implementation notes:
  - `InputManager` stores bindings as Phaser key codes and creates per-scene key maps via `getKeyMap`
  - Key maps are cleaned up on scene SHUTDOWN and DESTROY events
  - `getMovementVector` returns a normalized `{x, y}` vector
  - `isDown` and `wasPressed` check action state per scene
  - Settings-based rebinding UI is not yet implemented (see Step 13)

#### 7. Player Controller ✅ DONE
- Create player entity with movement logic
- Support top-down movement with direction and animation feedback
- Add speed and collision behavior
- Acceptance criteria:
  - player moves smoothly in world space
  - movement aligns with chosen input mapping
- Implementation notes:
  - Player movement is handled directly inside each world scene's `update` loop
  - Movement vector from `InputManager` is applied at 220 px/s with world-bounds clamping
  - `SpriteAnimationHandler` manages frame preloading and animation playback
  - Idle (4-frame, 2fps) and walk (6-frame, 9fps) animations are active

#### 8. Interaction System ✅ DONE
- Add interaction radius and prompt display logic
- Add interaction detection when player is within range
- Acceptance criteria:
  - prompt appears when near an interactable
  - interaction triggers logic only when key is pressed
- Implementation notes:
  - `checkInteractiveTiles` from `renderWorldMap` scans nearby tiles each update frame
  - When a tile with an `interact_action` is in range, `handleActionAvailable` fires and shows a label via UIManager
  - When out of range, `handleActionUnavailable` fires and removes the label
  - `Actions.js` defines the action types: SHAKE, PICK, READ, and RIPPLE

#### 9. Interactable Registry / Manager ✅ DONE
- Build a registry of active world interactables
- Add detection based on distance and proximity
- Support event callbacks or action dispatch
- Acceptance criteria:
  - each scene can register multiple interactables
  - only the nearest valid interactable is considered active
- Implementation notes:
  - Interaction detection is tile-driven: tiles in `tilePalette.js` carry an `interact_action` field
  - Proximity detection is built into `checkInteractiveTiles` in `renderWorldMap.js`
  - Scene-level callbacks (`handleActionAvailable`, `handleActionUnavailable`) dispatch behavior

#### 10. World Scene Setup ✅ DONE
- Build world scenes as Phaser.Scene subclasses
- Add data-driven map generation from 2D byte arrays
- Add at least two map layers: worldLayer and decorationLayer
- Map each tile ID to a sprite tile
- Add player spawn point to the world
- Add one basic interactable to test the flow
- Acceptance criteria:
  - world and decoration layers render from byte-array map data
  - a map loads and displays correctly
  - player can move around and interact with world objects
- Implementation notes:
  - `TownSquareScene` and `LazyLagoonScene` are both fully rendered from map data modules
  - `renderWorldMap` supports viewport culling via `refreshVisibleTiles` using an overscan buffer
  - Tile IDs map to sprite textures via `TILE_COLLECTION` in `tilePalette.js`
  - Map size is 250x250 tiles per world; tile size is configurable per map module
  - Town Square starts in the world center and E key currently triggers scene switch to Lazy Lagoon

---

### Phase 3: World Content and Progression
Priority: High

#### 11. Transition Controller ← CURRENT STEP
- Add screen-cover overlay animation
- Trigger transition before and after scene swap
- Ensure overlay fades or slides cleanly
- Acceptance criteria:
  - scene changes do not feel abrupt
  - transition timing remains consistent
- Notes:
  - Currently TownSquare hard-switches to LazyLagoon on E press with no overlay
  - This step should add a fade or slide panel that runs before and after `scene.start`

#### 12. Main Menu Flow ✅ DONE
- Create menu screen with Start Game, Load Game, and Settings actions
- Start a new game or load an existing save from the menu
- Acceptance criteria:
  - menu buttons function correctly
  - user can start a fresh game or load a save
- Implementation notes:
  - `MainMenuScene` has working Start Game and Load Game buttons
  - Start Game finds the first empty slot (or overwrites slot 0) and transitions to TownSquare
  - Load Game finds the first used slot and restores the saved scene
  - Settings button shows a "coming soon" stub

#### 13. Settings Menu
- Add volume slider
- Add keybinding panel with action list and key capture
- Persist settings in save configuration or user settings store
- Acceptance criteria:
  - volume changes take effect
  - key bindings can be rebound and saved

#### 14. Progression Manager
- Add science points tracking
- Add inventory tracking
- Track completed mini-games and unlocked items
- Add campaign-wide narrative flags for sinkhole aftermath and antagonist pressure
- Acceptance criteria:
  - values update correctly after game events
  - progression is reflected in the UI
  - story state can be saved and restored correctly

#### 15. HUD System
- Add persistent HUD for player stats
- Display science points, items, and companion status
- Show interaction prompt when viable
- Add visible community knowledge meter and story objective summary
- Acceptance criteria:
  - HUD updates in real time
  - world state is visible while playing
  - player can track the story and knowledge meter during exploration
- Implementation notes:
  - `GameSceneHUD` already displays world name, science points, and knowledge meter percentage
  - Full HUD with inventory, companions, and objective summary is still needed

#### 16. Cutscene and Dialogue Foundation
- Add a cutscene runner that executes async action sequences using promises
- Support action types such as wait, move, face, fade, trigger event, and dialogue
- Add a text-scroller that reveals characters one at a time
- Acceptance criteria:
  - actions execute in sequence with proper timing
  - dialogue text renders character by character and can be skipped

#### 17. World Locations Foundation ✅ PARTIALLY DONE
- Create map data modules for Town Square and additional locations
- Use shared schema for tileSize, playerSpawnTile, worldLayer, and decorationLayer
- Add world-specific interactable placement
- Acceptance criteria:
  - each location loads using the same scene framework
  - each location feels visually distinct
- Implementation notes:
  - Town Square and Lazy Lagoon are fully implemented as Phaser scenes with map data modules
  - Three remaining locations (Funky Forest, Sweaty Swamp, Pleasant Plains) are not yet added

#### 18. Scene Switcher Interactable
- Add a dedicated object type for changing scenes
- Configure destination scene ID and apply the transition controller
- Verify the player can move between locations
- Acceptance criteria:
  - interaction triggers scene transitions
  - world state persists correctly after switching scenes
- Notes:
  - Currently Town Square switches directly to Lazy Lagoon on E press as a placeholder
  - Needs to be replaced with a data-driven scene-switcher tied to specific world tiles or objects

---

### Phase 4: Mini-Games, Story, and Reward Loop
Priority: High

#### 19. Story and Antagonist Framework
- Add narrative manager to track the sinkhole disaster and Dr. Sudoscience takeover
- Add a public trust/community knowledge meter as the main campaign win condition
- Define antagonist influence states and trigger conditions for story pressure
- Acceptance criteria:
  - narrative state can be advanced through player actions
  - villain status is reflected in progression and story events

#### 20. Mini-Game Framework
- Create a base structure for mini-game scenes
- Add standardized start, complete, fail, and return flows
- Define reward payload format for mini-games
- Acceptance criteria:
  - each mini-game uses the same lifecycle model
  - reward data is returned consistently

#### 21. Bird Call Simon Mini-Game
- Build a memory/sequencing game scene based on bird calls
- Add input and UI for sequence matching
- Award science points or progression rewards on success
- Tie results to community knowledge gain and narrative progress
- Acceptance criteria:
  - the game functions end-to-end
  - success/failure results are passed back to the world state

#### 22. Fishing Derby Mini-Game
- Create a simple fishing interaction loop
- Add timing, cast, and catch mechanics
- Add reward data on completion
- Acceptance criteria:
  - game can be played and completed
  - reward updates player progression

#### 23. Bear Control Mini-Game
- Create a basic reaction or steering challenge
- Add win and lose logic
- Link result to progression data
- Acceptance criteria:
  - game loop works without crashes
  - reward is applied correctly

#### 24. Surveyor Mini-Game
- Add a scene that tests observation or collection logic
- Define scoring and reward system
- Acceptance criteria:
  - surveyor loop plays successfully
  - completion updates game state

#### 25. Story Objective and Antagonist Events
- Create a set of environmental story quests linked to world locations
- Add events where Dr. Sudoscience blocks or distorts the truth
- Reward the player for exposing evidence, building outreach, or restoring knowledge
- Acceptance criteria:
  - narrative events are tied to world interactions
  - the antagonist's influence changes as the knowledge meter rises

---

### Phase 5: Expanded World and Content Polish
Priority: Medium

#### 26. Remaining World Locations
- Implement Lazy Lagoon
- Implement Funky Forest
- Implement Sweaty Swamp
- Implement Pleasant Plains
- Acceptance criteria:
  - all locations load and feel distinct
  - world navigation between areas works consistently

#### 27. Companion Integration
- Add Noonie as a persistent character or companion element
- Add visual representation in world or HUD
- Accept relationship data and companion unlock flow
- Acceptance criteria:
  - companion is visible in gameplay or UI
  - companion state can be tracked in progression

#### 28. Environmental Story Events
- Add dialogues, prompts, or trigger-based events
- Hook to world interactables or stat checks
- Tie narrative scenes to the sinkhole fallout and Dr. Sudoscience's misinformation campaign
- Acceptance criteria:
  - simple event flow can trigger without breaking scene state

#### 29. Audio and SFX Support
- Add music and sound effects for menu, world, and minigames
- Add volume settings integration
- Acceptance criteria:
  - sound volume responds to settings changes
  - mixed audio load does not cause errors

---

### Phase 6: Polish and Quality
Priority: Medium

#### 27. UX and Feedback Pass
- Improve interaction prompts and hover feedback
- Add sprite movement polish and animation smoothing
- Tune transition durations and UI readability
- Acceptance criteria:
  - movement and interaction feel better than a simple prototype

#### 28. Bug Fix and Stability Pass
- Test save/load reliability
- Validate transition edge cases
- Test menu flow and scene resets
- Acceptance criteria:
  - no critical crashes in core workflows
  - save state remains valid after repeated usage

#### 29. Content Balance Pass
- Review progression rewards and mini-game difficulty
- Ensure science points and item progression are sensible
- Test pacing across world scenes and mini-games
- Acceptance criteria:
  - early game progression feels rewarding
  - later content remains manageable

#### 30. Final Playtest Preparation
- Run playthrough from start to end
- Validate end-to-end flows across menu, save, world, and mini-games
- Fix issues discovered by QA-style playtesting
- Acceptance criteria:
  - a complete loop is playable without major blockers

## 4. Recommended Delivery Order
If the goal is to build the game in a practical, low-risk order, use this sequence:

1. Project setup and bootstrap
2. Input + player movement
3. Interaction system + one simple world scene
4. Scene transitions
5. HUD + progression data
6. Save/load flow
7. Main menu + settings
8. One playable mini-game
9. Expand to additional locations and interactables
10. Polish and playtest

## 5. Suggested Milestone Schedule

### Milestone 1: Vertical Slice
Target outcome:
- single world scene
- working movement and interaction
- transition overlay
- basic HUD
- one mini-game loop

### Milestone 2: Playable Adventure Build
Target outcome:
- menu, settings, and save flow
- multiple world locations
- reward system and progression tracking
- at least two mini-games integrated

### Milestone 3: Full Game Foundation
Target outcome:
- all five locations
- all planned mini-games working
- companion data and world progression system integrated
- stable save behavior and UI polish

## 6. Definition of Done
A task should be considered complete when:

- the intended system works in the current build
- there are no obvious crashes or invalid state changes
- the feature is integrated with the active scene flow
- player-facing feedback is present where needed
- progression or save state is maintained correctly
- the feature can be tested by a fresh developer or playtester

## 7. Current Implementation State

Phases 1 and 2 are complete. The following has been implemented:

- Vite project with Phaser 3 (Steps 1-2)
- UIManager and GameSceneHUD for Phaser UI (Step 3)
- Scene registry with SaveManager and InputManager (Step 4)
- Three-slot save system via localStorage (Step 5)
- InputManager with normalized action bindings (Step 6)
- Player movement with sprite animations via SpriteAnimationHandler (Step 7)
- Tile-driven interaction proximity system (Steps 8-9)
- TownSquareScene and LazyLagoonScene with tile-based maps (Step 10)
- MainMenuScene with Start Game and Load Game flows (Step 12)

## 8. Immediate Next Steps

The highest-priority remaining work in order:

1. **Transition Controller (Step 11)** — add a screen-cover fade or slide overlay that runs before and after every `scene.start` call so scene changes feel polished
2. **Scene Switcher Interactable (Step 18)** — replace the current hardcoded E-key scene switch in TownSquare with a data-driven tile-based or object-based scene switcher that uses the transition controller
3. **Settings Menu (Step 13)** — build the settings scene with volume slider and keybinding rebind UI to complete the main menu flow
4. **Progression Manager (Step 14)** — centralize science points, inventory, and story flags so they survive scene transitions and can drive the HUD and win condition
5. **Full HUD (Step 15)** — extend GameSceneHUD to show inventory, companions, objectives, and the community knowledge meter
6. **Cutscene and Dialogue Foundation (Step 16)** — add the async cutscene runner and text-scroller so story beats can play between player actions
7. **Remaining World Locations (Step 17 / Phase 5)** — add Funky Forest, Sweaty Swamp, and Pleasant Plains using the existing scene and map framework
