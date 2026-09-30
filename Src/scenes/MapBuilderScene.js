import Phaser from 'phaser';
import UIManager from '../core/UIManager.js';
import { FadeIn } from '../core/SceneSwitcher.js';
import { MapBuilder } from '../core/MapBuilder.js';
import { TILE_COLLECTION, TILE_COLOR_PALETTE } from '../world/tilePalette.js';
import { getTileRenderWindow } from '../world/renderWorldMap.js';

export class MapBuilderScene extends Phaser.Scene {
  constructor() {
    super('MapBuilder');
    this.pageWidth = undefined;
    this.pageHeight = undefined;

    this.cellUpdates = false;
    this.cellMarkerPosition = {x: 0, y: 0};
  }

  async create() {
    const { width, height } = this.scale;
    this.pageWidth = this.registry.get('gameWidth') ?? width;
    this.pageHeight = this.registry.get('gameHeight') ?? height;
    
    this.inputManager = this.registry.get('inputManager');
    this.cameras.main.setBackgroundColor('#1d4ed8');
    this.uiManager = new UIManager(this);
    this.mapBuilder = new MapBuilder(250, 250);
    this.mapData = this.mapBuilder.getMap();

    const worldMap = this.mapData.worldLayer;
    const decorationMap = this.mapData.decorationLayer;

    this.cellMarker = this.add.graphics();
    this.cellMarker.setDepth(10);
    this.cellMarker.lineStyle(2, 0xff0000, 1);
    this.cellMarker.strokeRect(0, 0, this.mapData.tileSize, this.mapData.tileSize);

    this.renderMap();


    await FadeIn(this);
  }

  update() {
    this.checkInput();
    this.clearMap();
    this.renderMap();
    this.updateCellMarkerPosition(this.cellMarkerPosition.x, this.cellMarkerPosition.y);
    
  }

  checkInput() {
    if (this.inputManager.wasPressed(this, 'left')) {
      this.cellMarkerPosition.x = Math.max(0, this.cellMarkerPosition.x - 1);
      this.cellUpdates = true;
    }
    if (this.inputManager.wasPressed(this, 'right')) {
      this.cellMarkerPosition.x = Math.min(this.mapData.worldLayer[0].length - 1, this.cellMarkerPosition.x + 1);
      this.cellUpdates = true;
    }
    if (this.inputManager.wasPressed(this, 'down')) {
      this.cellMarkerPosition.y = Math.max(0, this.cellMarkerPosition.y - 1);
      this.cellUpdates = true;
    }
    if (this.inputManager.wasPressed(this, 'up')) {
      this.cellMarkerPosition.y = Math.min(this.mapData.worldLayer.length - 1, this.cellMarkerPosition.y + 1);
      this.cellUpdates = true;
    }
  }

  updateCellMarkerPosition(x, y) {
    this.cellMarkerPosition.x = x;
    this.cellMarkerPosition.y = y;
    this.cellMarker.setPosition(x * this.mapData.tileSize, y * this.mapData.tileSize);
  }

  renderMap() {
    const renderWindow = getTileRenderWindow(
      this.cameras.main,
      0,
      0,
      this.mapData.tileSize,
      this.mapData.worldLayer[0]?.length ?? 0,
      this.mapData.worldLayer.length,
    );

    this.mapGrid = this.add.graphics();
    this.mapGrid.lineStyle(1, 0x000000, 1);
    console.log('Render Window:', JSON.stringify(renderWindow));

    for (let y = renderWindow.startRow; y <= renderWindow.endRow; y++) {
        for (let x = renderWindow.startCol; x <= renderWindow.endCol; x++) {
            if (this.mapData.worldLayer[y][x] === 0) continue;
            this.drawTile(x, y, this.mapData.worldLayer[y][x], this.mapData.tileSize, this.mapGrid);
        }
    }

    for (let y = renderWindow.startRow; y <= renderWindow.endRow; y++) {
        for (let x = renderWindow.startCol; x <= renderWindow.endCol; x++) {
            if (this.mapData.decorationLayer[y][x] === 0) continue;
            this.drawTile(x, y, this.mapData.decorationLayer[y][x], this.mapData.tileSize, this.mapGrid);
        }
    }
  }

  drawTile(x, y, tileId, tileSize, graphics) {
    if (tileId === 0) return;

    const tileColor = TILE_COLOR_PALETTE[tileId] ?? 0xff00ff;
    graphics.fillStyle(tileColor, 1);
    graphics.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    graphics.lineStyle(1, 0x000000, 1);
    graphics.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
  }

  clearMap() {
    this.children.removeAll();
  }
}
