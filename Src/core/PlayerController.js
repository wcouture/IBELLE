import Phaser from 'phaser';
import { createPlayerVisual } from '../world/renderWorldMap.js';

export class PlayerController {
  constructor(scene, x, y, width, height, fallbackColor) {
    this.scene = scene;
    this.sprite = createPlayerVisual(scene, x, y, width, height, fallbackColor);
  }

  get x() {
    return this.sprite.x;
  }

  get y() {
    return this.sprite.y;
  }

  get width() {
    return this.sprite.width;
  }

  get height() {
    return this.sprite.height;
  }

  updateMovement(inputManager, animationHandler, worldBounds, speed = 220) {
    const movement = inputManager.getMovementVector(this.scene);
    const halfWidth = this.sprite.width / 2;
    const halfHeight = this.sprite.height / 2;

    this.sprite.x += movement.x * speed * (1 / 60);
    this.sprite.y += movement.y * speed * (1 / 60);

    this.sprite.x = Phaser.Math.Clamp(this.sprite.x, worldBounds.minX + halfWidth, worldBounds.maxX - halfWidth);
    this.sprite.y = Phaser.Math.Clamp(this.sprite.y, worldBounds.minY + halfHeight, worldBounds.maxY - halfHeight);

    const movementMagnitude = Math.hypot(movement.x, movement.y);
    if (movementMagnitude > 0) {
      const playbackRate = Phaser.Math.Linear(0.8, 1.4, movementMagnitude);
      animationHandler.play(this.sprite, 'player-walk', playbackRate);
    } else {
      animationHandler.play(this.sprite, 'player-idle', 1);
    }
  }
}
