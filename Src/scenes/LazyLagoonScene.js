import Phaser from 'phaser';
import { renderWorldMap } from '../world/renderWorldMap.js';
import { lazyLagoonMap } from '../world/maps/lazyLagoonMap.js';
import UIManager from './../core/UIManager.js';

export class LazyLagoonScene extends Phaser.Scene {
  constructor() {
    super('LazyLagoon');
  }

  create() {
    const { width, height } = this.scale;
    this.inputManager = this.registry.get('inputManager');
    this.cameras.main.setBackgroundColor('#1d4ed8');
    const uiManager = new UIManager(this);

    const generatedWorld = renderWorldMap(this, lazyLagoonMap);
    this.worldBounds = generatedWorld.bounds;

    this.player = this.add.rectangle(generatedWorld.spawnPoint.x, generatedWorld.spawnPoint.y, 22, 22, 0xfacc15);
    this.player.setDepth(2);

    uiManager.addLabel(32, 24, 'Lazy Lagoon');
    const backToTown = uiManager.addButton(width - 260, 40, 'Town Square', () => this.scene.start('TownSquare'));
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
