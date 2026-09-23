import Phaser from 'phaser';
import { createPlayerVisual, preloadPlayerSprite, preloadTileSprites, renderWorldMap } from '../world/renderWorldMap.js';
import { townSquareMap } from '../world/maps/townSquareMap.js';
import UIManager from '../core/UIManager.js';
import { GameSceneHUD } from '../ui/GameSceneHUD.js';
import { SpriteAnimationHandler } from '../core/SpriteAnimationHandler.js';

export class TownSquareScene extends Phaser.Scene {
  constructor() {
    super('TownSquare');
    this.gameSceneHUD = undefined;
    this.playerAnimationHandler = undefined;
    this.refreshVisibleTiles = undefined;
    this.checkInteractiveTiles = undefined;
    this.actionStates = {};
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
    this.inputManager = this.registry.get('inputManager');
    this.uiManager = new UIManager(this);
    
    // Display game scene HUD
    const save = this.registry.get('activeSave');
    this.gameSceneHUD = new GameSceneHUD(this.uiManager);
    this.gameSceneHUD.setWorld('Town Square');
    this.gameSceneHUD.setSciencePoints(save?.sciencePoints ?? 0);
    this.gameSceneHUD.setKnowledge(save?.knowledgeMeter ?? 0);

    // Generate world map
    this.cameras.main.setBackgroundColor('#2f7d5a');

    const generatedWorld = renderWorldMap(this, townSquareMap);
    this.worldBounds = generatedWorld.bounds;
    this.refreshVisibleTiles = generatedWorld.refreshVisibleTiles;
    this.checkInteractiveTiles = generatedWorld.checkInteractiveTiles;
    const playerWidth = townSquareMap.tileSize * 0.8;
    const playerHeight = townSquareMap.tileSize * 1.8;

    // Render player
    this.player = createPlayerVisual(
      this,
      generatedWorld.spawnPoint.x,
      generatedWorld.spawnPoint.y,
      playerWidth,
      playerHeight,
      0x38bdf8,
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
    this.playerAnimationHandler.play(this.player, 'player-idle');

    const camera = this.cameras.main;
    const worldWidth = this.worldBounds.maxX - this.worldBounds.minX;
    const worldHeight = this.worldBounds.maxY - this.worldBounds.minY;
    camera.setBounds(this.worldBounds.minX, this.worldBounds.minY, worldWidth, worldHeight);
    camera.setDeadzone(this.scale.width * 0.5, this.scale.height * 0.5);
    camera.startFollow(this.player, true, 0.2, 0.2);

    this.refreshVisibleTiles?.();
  }

  update() {
    if (this.inputManager.wasPressed(this, 'interact')) {
        this.scene.start('LazyLagoon');
    }

    const speed = 220;
    const movement = this.inputManager.getMovementVector(this);
    const halfWidth = this.player.width / 2;
    const halfHeight = this.player.height / 2;

    this.player.x += movement.x * speed * (1 / 60);
    this.player.y += movement.y * speed * (1 / 60);

    this.player.x = Phaser.Math.Clamp(this.player.x, this.worldBounds.minX + halfWidth, this.worldBounds.maxX - halfWidth);
    this.player.y = Phaser.Math.Clamp(this.player.y, this.worldBounds.minY + halfHeight, this.worldBounds.maxY - halfHeight);

    const movementMagnitude = Math.hypot(movement.x, movement.y);
    if (movementMagnitude > 0) {
      const playbackRate = Phaser.Math.Linear(0.8, 1.4, movementMagnitude);
      this.playerAnimationHandler.play(this.player, 'player-walk', playbackRate);
    } else {
      this.playerAnimationHandler.play(this.player, 'player-idle', 1);
    }

    this.refreshVisibleTiles?.();
    this.checkInteractiveTiles?.(this.player, this.handleActionAvailable.bind(this), this.handleActionUnavailable.bind(this));
  }

  handleActionAvailable(tileData, screenLocation, gridLocation) {
    if (this.actionStates) {
        const key = gridLocation.x + ',' + gridLocation.y;
        const label = this.uiManager.addLabel(screenLocation.x, screenLocation.y, tileData.interact_action.name, true, true);
        this.actionStates[key] = { available: true, uiElement: label };
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
}
