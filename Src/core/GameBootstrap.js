import Phaser from 'phaser';
import { SaveManager } from './SaveManager.js';
import { InputManager } from './InputManager.js';
import { ProgressionManager } from './ProgressionManager.js';
import { MainMenuScene } from '../scenes/MainMenuScene.js';
import { SettingsMenuScene } from '../scenes/SettingsMenuScene.js';
import { TownSquareScene } from '../scenes/TownSquareScene.js';
import { LazyLagoonScene } from '../scenes/LazyLagoonScene.js';
import { MapBuilderScene } from '../scenes/MapBuilderScene.js';

export class GameBootstrap {
  constructor() {
    this.saveManager = new SaveManager();
    this.inputManager = new InputManager();
    this.game = null;
    this.progressionManager = null;
  }

  start() {
    const gameWidth = 1280;
    const gameHeight = 720;

    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      width: gameWidth,
      height: gameHeight,
      parent: 'app',
      backgroundColor: '#0b1220',
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: [MainMenuScene, SettingsMenuScene, TownSquareScene, LazyLagoonScene, MapBuilderScene],
    });

    this.game.registry.set('gameWidth', gameWidth);
    this.game.registry.set('gameHeight', gameHeight);
    this.game.scale.on('resize', (gameSize) => {
      this.game.registry.set('gameWidth', Math.max(1, gameSize.width));
      this.game.registry.set('gameHeight', Math.max(1, gameSize.height));
    });

    this.game.registry.set('saveManager', this.saveManager);
    this.game.registry.set('inputManager', this.inputManager);
    this.progressionManager = new ProgressionManager(this.game.registry, { sciencePoints: 0, knowledgeMeter: 0 });
    this.game.registry.set('progressionManager', this.progressionManager);
    this.game.registry.set('settings', { volume: 0.8 });
    this.game.registry.set('activeSave', null);
  }
}
