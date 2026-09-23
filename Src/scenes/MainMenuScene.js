import Phaser from 'phaser';
import UIManager from '../core/UIManager.js';
import { MainMenuGUI } from '../ui/MainMenuGUI.js';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const { width, height } = this.scale;
    this.width = width;
    this.height = height;
    const uiManager = new UIManager(this);
    const mainMenuGUI = new MainMenuGUI(uiManager);

    this.cameras.main.setBackgroundColor('#111827');

    mainMenuGUI.subscribeToStartButton(this.onStartGame.bind(this));
    mainMenuGUI.subscribeToLoadButton(this.onLoadGame.bind(this));
    mainMenuGUI.subscribeToSettingsButton(this.onOpenSettings.bind(this));
  }

  onStartGame() {
      const saveManager = this.registry.get('saveManager');
      const saves = saveManager.loadAll();
      const slotIndex = saves.findIndex((save) => !save.used);
      const targetSlot = slotIndex >= 0 ? slotIndex : 0;
      const createdSave = saveManager.createSave(targetSlot, {
        scene: 'TownSquare',
        sciencePoints: 0,
        knowledgeMeter: 0,
        inventory: [],
        companions: ['Noonie'],
      });

      this.registry.set('activeSave', createdSave.state);
      this.scene.start('TownSquare');
  }

  onLoadGame() {
      const saveManager = this.registry.get('saveManager');
      const saves = saveManager.loadAll();
      const availableSave = saves.find((save) => save.used) ?? null;

      if (!availableSave || !availableSave.state) {
        this.add.text(this.width / 2, 560, 'No saves found.', {
          fontFamily: 'monospace',
          fontSize: '18px',
          color: '#fbbf24',
        }).setOrigin(0.5);
        return;
      }

      this.registry.set('activeSave', availableSave.state);
      this.scene.start(availableSave.state.scene || 'TownSquare');
  }

  onOpenSettings() {
      this.add.text(this.width / 2, 560, 'Settings menu coming soon.', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#a5f3fc',
      }).setOrigin(0.5);
  }
}
