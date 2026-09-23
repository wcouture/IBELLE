const MAP_SIZE = 250;
const CENTER = Math.floor(MAP_SIZE / 2);

function createLayer(fillValue) {
  return Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(fillValue));
}

function buildTownSquareWorldLayer() {
  const worldLayer = createLayer(1);

  for (let y = 0; y < MAP_SIZE; y += 1) {
    for (let x = 0; x < MAP_SIZE; x += 1) {
      const dx = Math.abs(x - CENTER);
      const dy = Math.abs(y - CENTER);

      if (dx <= 2 || dy <= 2) {
        worldLayer[y][x] = 3;
      }

      if ((dx <= 1 && dy <= 18) || (dy <= 1 && dx <= 18)) {
        worldLayer[y][x] = 2;
      }

      if (dx >= 115 || dy >= 115) {
        worldLayer[y][x] = 5;
      }
    }
  }

  for (let y = CENTER - 14; y <= CENTER + 14; y += 1) {
    for (let x = CENTER - 14; x <= CENTER + 14; x += 1) {
      const dx = Math.abs(x - CENTER);
      const dy = Math.abs(y - CENTER);
      if (dx + dy <= 18 && worldLayer[y][x] === 1) {
        worldLayer[y][x] = 2;
      }
    }
  }

  return worldLayer;
}

function buildTownSquareDecorationLayer(worldLayer) {
  const decorationLayer = createLayer(0);

  for (let y = 0; y < MAP_SIZE; y += 1) {
    for (let x = 0; x < MAP_SIZE; x += 1) {
      const tile = worldLayer[y][x];
      const noise = (x * 97 + y * 53 + x * y) % 100;

      if (tile === 1) {
        if (noise < 4) decorationLayer[y][x] = 100;
        else if (noise >= 4 && noise < 6) decorationLayer[y][x] = 101;
      }

      if (tile === 2 && noise === 42) {
        decorationLayer[y][x] = 102;
      }
    }
  }

  decorationLayer[CENTER][CENTER] = 102;
  return decorationLayer;
}

const worldLayer = buildTownSquareWorldLayer();
const decorationLayer = buildTownSquareDecorationLayer(worldLayer);

export const townSquareMap = {
  tileSize: 48,
  playerSpawnTile: { x: CENTER, y: CENTER },
  worldLayer,
  decorationLayer,
};
