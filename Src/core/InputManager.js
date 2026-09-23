import Phaser from 'phaser';

export class InputManager {
  constructor() {
    this.bindings = {
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
    };
  }

  getKeyMap(scene) {
    if (!scene.__inputKeyMap) {
      scene.__inputKeyMap = scene.input.keyboard.addKeys({
        up: this.bindings.up,
        down: this.bindings.down,
        left: this.bindings.left,
        right: this.bindings.right,
        interact: this.bindings.interact,
      });
    }

    return scene.__inputKeyMap;
  }

  getMovementVector(scene) {
    const keys = this.getKeyMap(scene);

    const moveX = (keys.right.isDown ? 1 : 0) - (keys.left.isDown ? 1 : 0);
    const moveY = (keys.down.isDown ? 1 : 0) - (keys.up.isDown ? 1 : 0);

    if (moveX === 0 && moveY === 0) {
      return { x: 0, y: 0 };
    }

    const length = Math.hypot(moveX, moveY) || 1;
    return {
      x: moveX / length,
      y: moveY / length,
    };
  }

  isDown(scene, action) {
    const keys = this.getKeyMap(scene);
    return !!keys[action]?.isDown;
  }
}
