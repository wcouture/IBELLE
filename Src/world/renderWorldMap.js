import { TILE_COLOR_PALETTE, TILE_COLLECTION } from './tilePalette.js';

const TILE_TEXTURE_KEY_PREFIX = 'tile:';
const PLAYER_TEXTURE_KEY = 'player:main';
const TILE_RENDER_OVERSCAN = 2;
const TILE_SPRITE_ASSETS = import.meta.glob('./tile_sprites/*.png', {
  eager: true,
  import: 'default',
});

function getTileSpriteAssetUrl(textureName) {
  return TILE_SPRITE_ASSETS[`./tile_sprites/${textureName}.png`] ?? null;
}

function getPlayerSpriteAssetUrl() {
  return TILE_SPRITE_ASSETS['./tile_sprites/player.png'] ?? null;
}

function getTileTextureKey(tileId) {
  const tile = TILE_COLLECTION[tileId];
  if (!tile?.texture) return null;
  return `${TILE_TEXTURE_KEY_PREFIX}${tile.texture}`;
}

function getTileRenderWindow(camera, originX, originY, tileSize, colCount, rowCount) {
  const view = camera.worldView;
  const startCol = Math.max(0, Math.floor((view.x - originX) / tileSize) - TILE_RENDER_OVERSCAN);
  const endCol = Math.min(
    colCount - 1,
    Math.ceil((view.right - originX) / tileSize) + TILE_RENDER_OVERSCAN,
  );
  const startRow = Math.max(0, Math.floor((view.y - originY) / tileSize) - TILE_RENDER_OVERSCAN);
  const endRow = Math.min(
    rowCount - 1,
    Math.ceil((view.bottom - originY) / tileSize) + TILE_RENDER_OVERSCAN,
  );

  return {
    startCol,
    endCol,
    startRow,
    endRow,
  };
}

export function preloadTileSprites(scene) {
  const queuedTextures = new Set();

  for (const tile of Object.values(TILE_COLLECTION)) {
    if (!tile?.texture || queuedTextures.has(tile.texture)) continue;

    const textureKey = `${TILE_TEXTURE_KEY_PREFIX}${tile.texture}`;
    if (!scene.textures.exists(textureKey)) {
      const assetUrl = getTileSpriteAssetUrl(tile.texture);
      if (assetUrl) {
        scene.load.image(textureKey, assetUrl);
      }
    }

    queuedTextures.add(tile.texture);
  }
}

export function preloadPlayerSprite(scene) {
  if (scene.textures.exists(PLAYER_TEXTURE_KEY)) return;

  const assetUrl = getPlayerSpriteAssetUrl();
  if (assetUrl) {
    scene.load.image(PLAYER_TEXTURE_KEY, assetUrl);
  }
}

export function createPlayerVisual(scene, x, y, width, height, fallbackColor) {
  if (scene.textures.exists(PLAYER_TEXTURE_KEY)) {
    const playerSprite = scene.add.sprite(x, y, PLAYER_TEXTURE_KEY);
    playerSprite.setDisplaySize(width, height);
    playerSprite.width = width;
    playerSprite.height = height;
    playerSprite.setDepth(2);
    return playerSprite;
  }

  const playerFallback = scene.add.rectangle(x, y, width, height, fallbackColor);
  playerFallback.setDepth(2);
  return playerFallback;
}

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

function drawTile(scene, parent, x, y, size, tileId) {
  if (tileId === 0) return;

  const textureKey = getTileTextureKey(tileId);
  if (textureKey && scene.textures.exists(textureKey)) {
    const tileSprite = scene.add.image(x + size / 2, y + size / 2, textureKey);
    tileSprite.setDisplaySize(size, size);
    parent.add(tileSprite);
    return;
  }

  if (!TILE_COLLECTION[tileId]) {
    const color = TILE_COLOR_PALETTE[tileId] ?? 0xff00ff;
    const fallbackTile = scene.add.rectangle(x + size / 2, y + size / 2, size, size, color);
    parent.add(fallbackTile);
    return;
  }

  const fallbackColor = TILE_COLOR_PALETTE[tileId] ?? 0xff00ff;
  const fallbackTile = scene.add.rectangle(x + size / 2, y + size / 2, size, size, fallbackColor);
  parent.add(fallbackTile);
}

export function renderWorldMap(scene, mapData) {
  const { tileSize, worldLayer, decorationLayer, playerSpawnTile } = mapData;
  validateLayerShape(worldLayer, decorationLayer);

  const rowCount = worldLayer.length;
  const colCount = worldLayer[0]?.length ?? 0;
  const mapWidth = colCount * tileSize;
  const mapHeight = rowCount * tileSize;

  const originX = 0;
  const originY = 0;
  const worldContainer = scene.add.container(0, 0).setDepth(0);
  const decorContainer = scene.add.container(0, 0).setDepth(1);
  let previousWindowKey = '';

  const refreshVisibleTiles = () => {
    const camera = scene.cameras.main;
    const tileWindow = getTileRenderWindow(camera, originX, originY, tileSize, colCount, rowCount);
    const windowKey = `${tileWindow.startCol}:${tileWindow.endCol}:${tileWindow.startRow}:${tileWindow.endRow}`;

    if (windowKey === previousWindowKey) return;
    previousWindowKey = windowKey;

    worldContainer.removeAll(true);
    decorContainer.removeAll(true);

    for (let y = tileWindow.startRow; y <= tileWindow.endRow; y += 1) {
      for (let x = tileWindow.startCol; x <= tileWindow.endCol; x += 1) {
        const worldId = worldLayer[y][x];
        const decorId = decorationLayer[y][x];
        const tileX = originX + x * tileSize;
        const tileY = originY + y * tileSize;

        drawTile(scene, worldContainer, tileX, tileY, tileSize, worldId);
        drawTile(scene, decorContainer, tileX, tileY, tileSize, decorId);
      }
    }
  };
  
  const interactableTileStates = new Map();
  const checkInteractiveTiles = (player, actionAvailableCallBack, actionUnavailableCallBack) => {
    const playerX = player.x;
    const playerY = player.y;
    for (let y = 0; y < rowCount; y += 1) {
      for (let x = 0; x < colCount; x += 1) {
        const decorId = decorationLayer[y][x];
        const tileData = TILE_COLLECTION[decorId];
        if (!tileData?.interactable) continue;

        const interactRadius = tileData.interact_radius ?? 0;
        const tileX = originX + x * tileSize;
        const tileY = originY + y * tileSize;

        const dx = playerX - (tileX + tileSize / 2);
        const dy = playerY - (tileY + tileSize / 2);

        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= interactRadius && actionAvailableCallBack && interactableTileStates.get(`${x},${y}`) !== true) {
          // Alert action available
          interactableTileStates.set(`${x},${y}`, true); 
          const screenLocation = {x: tileX, y: tileY};
          const gridLocation = {x: x, y: y};
          actionAvailableCallBack(tileData, screenLocation, gridLocation);
        } else if (distance > interactRadius && actionUnavailableCallBack && interactableTileStates.get(`${x},${y}`) === true) {
          // Alert action unavailable
          interactableTileStates.set(`${x},${y}`, false);
          const screenLocation = {x: tileX, y: tileY};
          const gridLocation = {x: x, y: y};
          actionUnavailableCallBack(tileData, screenLocation, gridLocation);
        }
      }
    }
  };

  refreshVisibleTiles();

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
    refreshVisibleTiles,
    checkInteractiveTiles,
  };
}
