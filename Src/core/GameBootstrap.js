import Phaser from 'phaser';
import { SaveManager } from './SaveManager.js';
import { InputManager } from './InputManager.js';
import { MainMenuScene } from '../scenes/MainMenuScene.js';
import { TownSquareScene } from '../scenes/TownSquareScene.js';
import { LazyLagoonScene } from '../scenes/LazyLagoonScene.js';

export class GameBootstrap {
  constructor() {
    this.saveManager = new SaveManager();
    this.inputManager = new InputManager();
    this.game = null;
  }

  start() {
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 1280,
      height: 720,
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
      scene: [MainMenuScene, TownSquareScene, LazyLagoonScene],
    });

    this.game.registry.set('saveManager', this.saveManager);
    this.game.registry.set('inputManager', this.inputManager);
    this.game.registry.set('activeSave', null);
  }
}
