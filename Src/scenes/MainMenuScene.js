import Phaser from 'phaser';
import UIManager from './../core/UIManager.js';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const { width, height } = this.scale;
    const uiManager = new UIManager(this);
    this.cameras.main.setBackgroundColor('#111827');

    uiManager.addLabel(width / 2, 120, 'IBELLE');

    const startButton = uiManager.addButton(width / 2, 260, 'Start Game', () => {
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
    });

    const loadButton = uiManager.addButton(width / 2, 330, 'Load Game', () => {
      const saveManager = this.registry.get('saveManager');
      const saves = saveManager.loadAll();
      const availableSave = saves.find((save) => save.used) ?? null;

      if (!availableSave || !availableSave.state) {
        this.add.text(width / 2, 560, 'No saves found.', {
          fontFamily: 'monospace',
          fontSize: '18px',
          color: '#fbbf24',
        }).setOrigin(0.5);
        return;
      }

      this.registry.set('activeSave', availableSave.state);
      this.scene.start(availableSave.state.scene || 'TownSquare');
    });

    const settingsButton = uiManager.addButton(width / 2, 400, 'Settings', () => {
      this.add.text(width / 2, 560, 'Settings menu coming soon.', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#a5f3fc',
      }).setOrigin(0.5);
    });
    // const startButton = this.add.text(width / 2, 260, 'Start Game', {
    //   fontFamily: 'monospace',
    //   fontSize: '28px',
    //   color: '#0f172a',
    //   backgroundColor: '#5eead4',
    //   padding: { x: 24, y: 12 },
    // }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // const loadButton = this.add.text(width / 2, 330, 'Load Game', {
    //   fontFamily: 'monospace',
    //   fontSize: '24px',
    //   color: '#e2e8f0',
    //   backgroundColor: '#1f2937',
    //   padding: { x: 22, y: 10 },
    // }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // const settingsButton = this.add.text(width / 2, 400, 'Settings', {
    //   fontFamily: 'monospace',
    //   fontSize: '24px',
    //   color: '#e2e8f0',
    //   backgroundColor: '#1f2937',
    //   padding: { x: 22, y: 10 },
    // }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    // startButton.on('pointerdown', () => {
    //   const saveManager = this.registry.get('saveManager');
    //   const saves = saveManager.loadAll();
    //   const slotIndex = saves.findIndex((save) => !save.used);
    //   const targetSlot = slotIndex >= 0 ? slotIndex : 0;
    //   const createdSave = saveManager.createSave(targetSlot, {
    //     scene: 'TownSquare',
    //     sciencePoints: 0,
    //     knowledgeMeter: 0,
    //     inventory: [],
    //     companions: ['Noonie'],
    //   });

    //   this.registry.set('activeSave', createdSave.state);
    //   this.scene.start('TownSquare');
    // });

    // loadButton.on('pointerdown', () => {
    //   const saveManager = this.registry.get('saveManager');
    //   const saves = saveManager.loadAll();
    //   const availableSave = saves.find((save) => save.used) ?? null;

    //   if (!availableSave || !availableSave.state) {
    //     this.add.text(width / 2, 560, 'No saves found.', {
    //       fontFamily: 'monospace',
    //       fontSize: '18px',
    //       color: '#fbbf24',
    //     }).setOrigin(0.5);
    //     return;
    //   }

    //   this.registry.set('activeSave', availableSave.state);
    //   this.scene.start(availableSave.state.scene || 'TownSquare');
    // });

    // settingsButton.on('pointerdown', () => {
    //   this.add.text(width / 2, 560, 'Settings menu coming soon.', {
    //     fontFamily: 'monospace',
    //     fontSize: '18px',
    //     color: '#a5f3fc',
    //   }).setOrigin(0.5);
    // });
  }
}
