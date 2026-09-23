import Phaser from 'phaser';
import { renderWorldMap } from '../world/renderWorldMap.js';
import { townSquareMap } from '../world/maps/townSquareMap.js';
import UIManager from './../core/UIManager.js';

export class TownSquareScene extends Phaser.Scene {
  constructor() {
    super('TownSquare');
  }

  create() {
    const { width, height } = this.scale;
    const inputManager = this.registry.get('inputManager');
    const uiManager = new UIManager(this);

    this.cameras.main.setBackgroundColor('#2f7d5a');

    const generatedWorld = renderWorldMap(this, townSquareMap);
    this.worldBounds = generatedWorld.bounds;

    this.player = this.add.rectangle(generatedWorld.spawnPoint.x, generatedWorld.spawnPoint.y, 24, 24, 0x38bdf8);
    this.player.setDepth(2);

    this.inputManager = inputManager;

    uiManager.addLabel(32, 24, 'Welcome to the Town Square!');

    const save = this.registry.get('activeSave');
    this.hudText = uiManager.addLabel(32, 62, `Science Points: ${save?.sciencePoints ?? 0} | Knowledge: ${save?.knowledgeMeter ?? 0}%`); 

    uiManager.addLabel(width - 180, height - 40, 'Press E to interact');
    uiManager.addLabel(width - 250, 40, 'Scene Switcher');

    uiManager.addButton(width - 230, 80, 'Main Menu', () => this.scene.start('MainMenu'));
    uiManager.addButton(width - 230, 120, 'Lazy Lagoon', () => this.scene.start('LazyLagoon'));
  }

  update() {
    const speed = 220;
    const movement = this.inputManager.getMovementVector(this);
    const halfWidth = this.player.width / 2;
    const halfHeight = this.player.height / 2;

    this.player.x += movement.x * speed * (1 / 60);
    this.player.y += movement.y * speed * (1 / 60);

    this.player.x = Phaser.Math.Clamp(this.player.x, this.worldBounds.minX + halfWidth, this.worldBounds.maxX - halfWidth);
    this.player.y = Phaser.Math.Clamp(this.player.y, this.worldBounds.minY + halfHeight, this.worldBounds.maxY - halfHeight);
  }
}
