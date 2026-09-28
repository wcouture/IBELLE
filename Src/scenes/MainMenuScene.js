import Phaser from 'phaser';
import UIManager from '../core/UIManager.js';
import { MainMenuGUI } from '../ui/MainMenuGUI.js';
import { SwitchScene, FadeIn } from '../core/SceneSwitcher.js';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const { width, height } = this.scale;
    FadeIn(this);

    this.width = width;
    this.height = height;
    const pageWidth = this.registry.get('gameWidth') ?? width;
    const pageHeight = this.registry.get('gameHeight') ?? height;
    const uiManager = new UIManager(this);
    const mainMenuGUI = new MainMenuGUI(uiManager, pageWidth, pageHeight);

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

      this.registry.set('saveSlotIndex', targetSlot);
      this.registry.set('activeSave', createdSave.state);
      const progressionManager = this.registry.get('progressionManager');
      if (progressionManager) {
        progressionManager.hydrateFromSave(createdSave.state);
      }
      SwitchScene(this, 'TownSquare');
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

      this.registry.set('saveSlotIndex', saves.indexOf(availableSave));
      this.registry.set('activeSave', availableSave.state);
      const progressionManager = this.registry.get('progressionManager');
      if (progressionManager) {
        progressionManager.hydrateFromSave(availableSave.state);
      }
      SwitchScene(this, availableSave.state.scene || 'TownSquare');
  }

  onOpenSettings() {
      SwitchScene(this, 'SettingsMenu');
  }
}
