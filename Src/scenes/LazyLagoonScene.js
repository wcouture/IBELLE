import Phaser from 'phaser';
import { preloadPlayerSprite, preloadTileSprites, renderWorldMap } from '../world/renderWorldMap.js';
import { PlayerController } from '../core/PlayerController.js';
import { lazyLagoonMap } from '../world/maps/lazyLagoonMap.js';
import UIManager from '../core/UIManager.js';
import { GameSceneHUD } from '../ui/GameSceneHUD.js';
import { SpriteAnimationHandler } from '../core/SpriteAnimationHandler.js';
import { SwitchScene, FadeIn } from '../core/SceneSwitcher.js';
import { ACTIONS } from '../core/Actions.js';

export class LazyLagoonScene extends Phaser.Scene {
  constructor() {
    super('LazyLagoon');
    this.gameSceneHUD = undefined;
    this.playerAnimationHandler = undefined;
    this.refreshVisibleTiles = undefined;
    this.checkInteractiveTiles = undefined;
    this.actionStates = {};
    this.signMessages = {};
    this.pageWidth = undefined;
    this.pageHeight = undefined;
  }

  preload() {
    this.playerAnimationHandler = new SpriteAnimationHandler(this);
    preloadTileSprites(this);
    preloadPlayerSprite(this);
    this.playerAnimationHandler.preloadFrameSeries([
      {
        seriesKey: 'player-idle',
        framePrefix: 'player_idle_',
        startFrame: 0,
        endFrame: 3,
      },
      {
        seriesKey: 'player-walk',
        framePrefix: 'player_walk_',
        startFrame: 0,
        endFrame: 5,
      },
    ]);
  }

  create() {
    const { width, height } = this.scale;
    FadeIn(this);
    this.inputManager = this.registry.get('inputManager');
    this.cameras.main.setBackgroundColor('#1d4ed8');
    this.uiManager = new UIManager(this);

    const progressionManager = this.registry.get('progressionManager');
    const save = this.registry.get('activeSave');
    if (progressionManager) {
      progressionManager.hydrateFromSave(save);
    }

    this.pageWidth = this.registry.get('gameWidth') ?? width;
    this.pageHeight = this.registry.get('gameHeight') ?? height;

    // Initialize game scene HUD
    this.gameSceneHUD = new GameSceneHUD(this.uiManager, this.pageWidth, this.pageHeight);
    this.gameSceneHUD.setWorld('Lazy Lagoon');
    this.gameSceneHUD.setSciencePoints(progressionManager?.getSciencePoints() ?? save?.sciencePoints ?? 0);
    this.gameSceneHUD.setKnowledge(progressionManager?.getKnowledgeMeter() ?? save?.knowledgeMeter ?? 0);

    // Generate world map
    const generatedWorld = renderWorldMap(this, lazyLagoonMap);
    this.worldBounds = generatedWorld.bounds;
    this.refreshVisibleTiles = generatedWorld.refreshVisibleTiles;
    this.checkInteractiveTiles = generatedWorld.checkInteractiveTiles;
    this.signMessages = generatedWorld.signMessages;
    const playerWidth = lazyLagoonMap.tileSize * 0.8;
    const playerHeight = lazyLagoonMap.tileSize * 1.8;

    // Render player
    this.player = new PlayerController(
      this,
      generatedWorld.spawnPoint.x,
      generatedWorld.spawnPoint.y,
      playerWidth,
      playerHeight,
      0xfacc15,
    );

    this.playerAnimationHandler.createAnimations([
      {
        animationKey: 'player-idle',
        seriesKey: 'player-idle',
        frameRate: 2,
      },
      {
        animationKey: 'player-walk',
        seriesKey: 'player-walk',
        frameRate: 9,
      },
    ]);
    this.playerAnimationHandler.play(this.player.sprite, 'player-idle');

    const camera = this.cameras.main;
    const worldWidth = this.worldBounds.maxX - this.worldBounds.minX;
    const worldHeight = this.worldBounds.maxY - this.worldBounds.minY;
    camera.setBounds(this.worldBounds.minX, this.worldBounds.minY, worldWidth, worldHeight);
    camera.setDeadzone(this.scale.width * 0.5, this.scale.height * 0.5);
    camera.startFollow(this.player.sprite, true, 0.2, 0.2);

    this.refreshVisibleTiles?.();
  }

  update() {
    if (this.inputManager.wasPressed(this, 'interact')) {
      if (this.uiManager.activeDialog) {
        this.uiManager.removeDialog();
        return;
      }

      const readEntry = Object.entries(this.actionStates).find(
        ([, state]) => state.available && state.tileData?.interact_action === ACTIONS.READ,
      );
      if (readEntry) {
        this.handleSignRead(readEntry[0]);
      } else {
        SwitchScene(this, 'TownSquare');
      }
    }

    this.player.updateMovement(this.inputManager, this.playerAnimationHandler, this.worldBounds);

    this.refreshVisibleTiles?.();
    this.checkInteractiveTiles?.(this.player, this.handleActionAvailable.bind(this), this.handleActionUnavailable.bind(this));
  }

  handleActionAvailable(tileData, screenLocation, gridLocation) {
    if (this.actionStates) {
        const key = gridLocation.x + ',' + gridLocation.y;
        const label = this.uiManager.addLabel(screenLocation.x, screenLocation.y, tileData.interact_action.name, true, true);
        this.actionStates[key] = { available: true, uiElement: label, tileData };
    }
  }

  handleActionUnavailable(tileData, screenLocation, gridLocation) {
    if (this.actionStates) {
        const key = gridLocation.x + ',' + gridLocation.y;
        const actionState = this.actionStates[key];
        if (!actionState) return;

        actionState.available = false;
        if (actionState?.uiElement) {
            this.uiManager.removeLabel(actionState.uiElement, true);
            actionState.uiElement = null;
        }
    }
  }

  handleSignRead(gridKey) {
    const message = this.signMessages[gridKey] ?? 'The sign is blank.';
    this.uiManager.addDialog(message, this.pageWidth, this.pageHeight);
  }
}
