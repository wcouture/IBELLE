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

### Phase 1: Foundation and Tooling
Priority: Must have

#### 1. Project Setup
- Create project structure for the web game
- Set up package manager and build tooling
- Configure development scripts for local run and production build
- Add directory structure for scenes, systems, entities, UI, data, and saves
- Acceptance criteria:
  - project runs locally
  - developer can launch a blank scene and see output

#### 2. Phaser 3 Bootstrap
- Create a Phaser-based game bootstrap
- Initialize the game config and main scene flow
- Add a basic game loop and resize handling
- Acceptance criteria:
  - a blank or placeholder scene renders successfully
  - app updates each frame without errors

#### 3. UI and HUD in Phaser Scenes
- Build menu, HUD, and overlays using Phaser scene UI objects
- Add loading screen or placeholder splash state
- Keep overlay/panel behavior consistent across scenes
- Acceptance criteria:
  - UI elements render correctly in Phaser scenes
  - layout is stable across screen sizes

#### 4. Phaser Scene Flow and Registry State
- Use Phaser ScenePlugin for scene transitions and lifecycle
- Use game registry + save systems for shared game state
- Define transition hooks between menu, world, and minigame scenes
- Acceptance criteria:
  - scenes can be switched cleanly
  - state shared through registry and save systems remains consistent

#### 5. Save Data Model
- Define save-file structure
- Add save slot metadata
- Build a save/load API for browser localStorage or equivalent
- Acceptance criteria:
  - save slots can be created and loaded
  - save state persists after refresh or reload

---

### Phase 2: Core Gameplay Systems
Priority: Must have

#### 6. Input Manager and Keybinding System
- Wrap Phaser keyboard input for normalized actions
- Define action names for movement and interaction
- Add settings-based key rebinding flow
- Default keys:
  - WASD / arrow keys for movement
  - E for interaction
- Acceptance criteria:
  - movement responds to configured keys
  - key bindings can be updated from the settings menu

#### 7. Player Controller
- Create player entity with movement logic
- Support top-down movement with direction and animation feedback
- Add speed and collision behavior
- Acceptance criteria:
  - player moves smoothly in world space
  - movement aligns with chosen input mapping

#### 8. Interaction System
- Create interactable base class or interface
- Add interaction radius and prompt display logic
- Add interaction detection when player is within range
- Acceptance criteria:
  - prompt appears when near an interactable
  - interaction triggers logic only when key is pressed

#### 9. Interactable Registry / Manager
- Build a registry of active world interactables
- Add detection based on distance and proximity
- Support event callbacks or action dispatch
- Acceptance criteria:
  - each scene can register multiple interactables
  - only the nearest valid interactable is considered active

#### 10. World Scene Setup
- Build world scenes as Phaser.Scene subclasses
- Add data-driven map generation from 2D byte arrays
- Add at least two map layers: worldLayer and decorationLayer
- Map each tile ID to a color placeholder (later to sprite tile)
- Add player spawn point to the world
- Add one basic interactable to test the flow
- Acceptance criteria:
  - world and decoration layers render from byte-array map data
  - a map loads and displays correctly
  - player can move around and interact with world objects

#### 11. Transition Controller
- Add screen-cover overlay animation
- Trigger transition before and after scene swap
- Ensure overlay fades or slides cleanly
- Acceptance criteria:
  - scene changes do not feel abrupt
  - transition timing remains consistent

---

### Phase 3: World Content and Progression
Priority: High

#### 12. Main Menu Flow
- Create menu screen with Start Game, Load Game, and Settings actions
- Add save-slot selection for new game
- Add save-slot selection for loading a game
- Acceptance criteria:
  - menu buttons function correctly
  - user can start a fresh game or load a save

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

#### 16. Cutscene and Dialogue Foundation
- Add a cutscene runner that executes async action sequences using promises
- Support action types such as wait, move, face, fade, trigger event, and dialogue
- Add a text-scroller that reveals characters one at a time
- Acceptance criteria:
  - actions execute in sequence with proper timing
  - dialogue text renders character by character and can be skipped

#### 17. World Locations Foundation
- Create map data modules for Town Square and additional locations
- Use shared schema for tileSize, playerSpawnTile, worldLayer, and decorationLayer
- Add at least 2 additional world areas with distinct colors and props
- Add world-specific interactable placement
- Acceptance criteria:
  - each location loads using the same scene framework
  - each location feels visually distinct

#### 18. Scene Switcher Interactable
- Add a dedicated object type for changing scenes
- Configure destination id and transition timing
- Verify the player can move between locations
- Acceptance criteria:
  - interaction triggers scene transitions
  - world state persists correctly after switching scenes

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

## 7. Immediate Next Step
The best first implementation batch is:

- project bootstrap
- scene manager
- input manager
- player controller
- basic interactable system
- world scene prototype
- transition overlay
- save data model

This gives the project a solid playable foundation before deeper content and mini-game work begins.
