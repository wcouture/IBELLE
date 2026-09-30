import Phaser from 'phaser';
import UIManager from '../core/UIManager.js';
import { FadeIn } from '../core/SceneSwitcher.js';
import { MapBuilder } from '../core/MapBuilder.js';
import { TILE_COLLECTION, TILE_COLOR_PALETTE } from '../world/tilePalette.js';

export class MapBuilderScene extends Phaser.Scene {
  constructor() {
    super('MapBuilder');
    this.pageWidth = undefined;
    this.pageHeight = undefined;
  }

  async create() {
    const { width, height } = this.scale;
    this.pageWidth = this.registry.get('gameWidth') ?? width;
    this.pageHeight = this.registry.get('gameHeight') ?? height;
    
    this.inputManager = this.registry.get('inputManager');
    this.cameras.main.setBackgroundColor('#1d4ed8');
    this.uiManager = new UIManager(this);
    this.mapBuilder = new MapBuilder(250, 250);
    const mapData = this.mapBuilder.getMap();

    const worldMap = mapData.worldLayer;
    const decorationMap = mapData.decorationLayer;

    for (let y = 0; y < worldMap.length; y++) {
        for (let x = 0; x < worldMap[y].length; x++) {
            this.drawTile(x, y, worldMap[y][x]);
        }
    }

    for (let y = 0; y < decorationMap.length; y++) {
        for (let x = 0; x < decorationMap[y].length; x++) {
            this.drawTile(x, y, decorationMap[y][x]);
        }
    }

    await FadeIn(this);
  }

  drawTile(x, y, tileId) {
    if (tileId === 0) return;

    const tileColor = TILE_COLOR_PALETTE[tileId] ?? 0xff00ff;
    const borderColor = 0x000000;
    const size = 12; // Assuming the tile size is 12 as in MapBuilder
    const tile = this.add.rectangle(x * size + size / 2, y * size + size / 2, size, size, tileColor);
    tile.setStrokeStyle(1, borderColor);
  }

  clearMap() {
    this.children.removeAll();
  }
}
