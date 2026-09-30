import Phaser from 'phaser';

export class InputManager {
  constructor() {
    this.bindings = {
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      interact: Phaser.Input.Keyboard.KeyCodes.E,
      mouseLeft: Phaser.Input.Mouse.LEFT,
      mouseRight: Phaser.Input.Mouse.RIGHT,
    };
  }

  keyCodeToLabel(keyCode) {
    const labelMap = {
      [Phaser.Input.Keyboard.KeyCodes.W]: 'W',
      [Phaser.Input.Keyboard.KeyCodes.A]: 'A',
      [Phaser.Input.Keyboard.KeyCodes.S]: 'S',
      [Phaser.Input.Keyboard.KeyCodes.D]: 'D',
      [Phaser.Input.Keyboard.KeyCodes.E]: 'E',
      [Phaser.Input.Keyboard.KeyCodes.Q]: 'Q',
      [Phaser.Input.Keyboard.KeyCodes.R]: 'R',
      [Phaser.Input.Keyboard.KeyCodes.F]: 'F',
      [Phaser.Input.Keyboard.KeyCodes.UP]: '↑',
      [Phaser.Input.Keyboard.KeyCodes.DOWN]: '↓',
      [Phaser.Input.Keyboard.KeyCodes.LEFT]: '←',
      [Phaser.Input.Keyboard.KeyCodes.RIGHT]: '→',
      [Phaser.Input.Keyboard.KeyCodes.SPACE]: 'Space',
      [Phaser.Input.Keyboard.KeyCodes.ENTER]: 'Enter',
      [Phaser.Input.Keyboard.KeyCodes.ESC]: 'Esc',
      [Phaser.Input.Mouse.LEFT]: 'Mouse Left',
      [Phaser.Input.Mouse.RIGHT]: 'Mouse Right',
    };

    if (keyCode === undefined || keyCode === null) {
      return 'Unbound';
    }

    const mappedLabel = labelMap[keyCode];
    if (mappedLabel) {
      return mappedLabel;
    }

    const fallback = String.fromCharCode(keyCode).toUpperCase();
    return fallback || 'Unbound';
  }

  clearSceneKeyMap(scene) {
    if (scene.__inputKeyMap) {
      scene.__inputKeyMap = null;
    }

    if (scene.__inputKeyMapLifecycleBound) {
      scene.__inputKeyMapLifecycleBound = false;
    }
  }

  getBindingLabel(action) {
    return this.keyCodeToLabel(this.bindings[action]);
  }

  rebindAction(scene, action, keyCode) {
    if (!(action in this.bindings)) {
      return false;
    }

    if (keyCode === undefined || keyCode === null) {
      return false;
    }

    this.bindings[action] = keyCode;

    if (scene && scene.__inputKeyMap) {
      this.clearSceneKeyMap(scene);
    }

    return true;
  }

  getKeyMap(scene) {
    if (!scene.__inputKeyMapLifecycleBound) {
      scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
        this.clearSceneKeyMap(scene);
      });

      scene.events.once(Phaser.Scenes.Events.DESTROY, () => {
        this.clearSceneKeyMap(scene);
      });

      scene.__inputKeyMapLifecycleBound = true;
    }

    const hasValidKeyMap =
      scene.__inputKeyMap &&
      scene.__inputKeyMap.up &&
      scene.__inputKeyMap.down &&
      scene.__inputKeyMap.left &&
      scene.__inputKeyMap.right &&
      scene.__inputKeyMap.interact;

    if (!hasValidKeyMap) {
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

  wasPressed(scene, action) {
    const keys = this.getKeyMap(scene);
    const key = keys[action];

    if (!key) {
      return false;
    }

    return Phaser.Input.Keyboard.JustDown(key);
  }
}
