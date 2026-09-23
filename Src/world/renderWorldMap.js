import { TILE_COLOR_PALETTE } from './tilePalette.js';

function validateLayerShape(worldLayer, decorationLayer) {
  if (worldLayer.length !== decorationLayer.length) {
    throw new Error('World and decoration layers must have the same row count.');
  }

  for (let y = 0; y < worldLayer.length; y += 1) {
    if (worldLayer[y].length !== decorationLayer[y].length) {
      throw new Error(`Layer column mismatch at row ${y}.`);
    }
  }
}

function drawTile(scene, x, y, size, tileId, depth) {
  if (tileId === 0) return;

  const color = TILE_COLOR_PALETTE[tileId] ?? 0xff00ff;
  if (color == null) return;

  const tile = scene.add.rectangle(x + size / 2, y + size / 2, size, size, color);
  tile.setDepth(depth);
}

export function renderWorldMap(scene, mapData) {
  const { tileSize, worldLayer, decorationLayer, playerSpawnTile } = mapData;
  validateLayerShape(worldLayer, decorationLayer);

  const rowCount = worldLayer.length;
  const colCount = worldLayer[0]?.length ?? 0;
  const mapWidth = colCount * tileSize;
  const mapHeight = rowCount * tileSize;

  const originX = Math.floor((scene.scale.width - mapWidth) / 2);
  const originY = Math.floor((scene.scale.height - mapHeight) / 2);

  for (let y = 0; y < rowCount; y += 1) {
    for (let x = 0; x < colCount; x += 1) {
      const worldId = worldLayer[y][x];
      const decorId = decorationLayer[y][x];
      const tileX = originX + x * tileSize;
      const tileY = originY + y * tileSize;

      drawTile(scene, tileX, tileY, tileSize, worldId, 0);
      drawTile(scene, tileX, tileY, tileSize, decorId, 1);
    }
  }

  const spawnX = originX + playerSpawnTile.x * tileSize + tileSize / 2;
  const spawnY = originY + playerSpawnTile.y * tileSize + tileSize / 2;

  return {
    bounds: {
      minX: originX,
      minY: originY,
      maxX: originX + mapWidth,
      maxY: originY + mapHeight,
    },
    spawnPoint: {
      x: spawnX,
      y: spawnY,
    },
  };
}
