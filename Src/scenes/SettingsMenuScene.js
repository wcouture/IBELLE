import Phaser from 'phaser';
import UIManager from '../core/UIManager.js';
import { SettingsMenuGUI } from '../ui/SettingsMenuGUI.js';
import { SwitchScene } from '../core/SceneSwitcher.js';

export class SettingsMenuScene extends Phaser.Scene {
  constructor() {
    super('SettingsMenu');
    this.inputManager = null;
    this.settingsGui = null;
    this.isCapturingBinding = false;
    this.captureAction = null;
  }

  create() {
    const { width, height } = this.scale;
    this.width = width;
    this.height = height;

    this.inputManager = this.registry.get('inputManager');
    const pageWidth = this.registry.get('gameWidth') ?? width;
    const pageHeight = this.registry.get('gameHeight') ?? height;
    const uiManager = new UIManager(this);
    const settings = this.registry.get('settings') ?? { volume: 80 };
    this.settingsGui = new SettingsMenuGUI(uiManager, this.inputManager, settings.volume ?? 80, pageWidth, pageHeight);

    this.cameras.main.setBackgroundColor('#111827');
    this.settingsGui.subscribeToBack(() => {
      SwitchScene(this, 'MainMenu');
    });

    this.settingsGui.subscribeToVolumeChange((volume) => {
      const currentSettings = this.registry.get('settings') ?? { volume: 80 };
      this.registry.set('settings', {
        ...currentSettings,
        volume,
      });
    });

    this.settingsGui.subscribeToCaptureStart((action) => {
      this.isCapturingBinding = true;
      this.captureAction = action;
    });

    this.input.keyboard.on('keydown', (event) => {
      if (!this.isCapturingBinding || !this.captureAction) {
        return;
      }

      const keyCode = event.keyCode;
      if (keyCode === undefined || keyCode === null) {
        return;
      }

      this.inputManager.rebindAction(this, this.captureAction, keyCode);
      this.settingsGui.refreshBindings();
      this.clearBindingCapture();
    });
  }

  clearBindingCapture() {
    this.isCapturingBinding = false;
    this.captureAction = null;
    this.settingsGui?.clearCapture();
  }
}
