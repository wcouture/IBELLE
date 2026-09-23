const MAP_SIZE = 250;
const CENTER = Math.floor(MAP_SIZE / 2);

function createLayer(fillValue) {
  return Array.from({ length: MAP_SIZE }, () => Array(MAP_SIZE).fill(fillValue));
}

function buildLagoonWorldLayer() {
  const worldLayer = createLayer(1);

  for (let y = 0; y < MAP_SIZE; y += 1) {
    for (let x = 0; x < MAP_SIZE; x += 1) {
      const normalizedX = (x - CENTER) / 70;
      const normalizedY = (y - CENTER) / 60;
      const radius = normalizedX * normalizedX + normalizedY * normalizedY;

      if (radius < 1.0) {
        worldLayer[y][x] = 4;
      }

      if (radius < 0.22) {
        worldLayer[y][x] = 2;
      }

      if (radius >= 0.22 && radius < 0.30) {
        worldLayer[y][x] = 3;
      }

      if (Math.abs(y - CENTER) <= 2 && Math.abs(x - CENTER) <= 90) {
        worldLayer[y][x] = 3;
      }

      if (Math.abs(x - CENTER) <= 2 && Math.abs(y - CENTER) <= 90) {
        worldLayer[y][x] = 3;
      }

      if (Math.abs(x - CENTER) <= 1 && Math.abs(y - CENTER) <= 18) {
        worldLayer[y][x] = 2;
      }

      if (Math.abs(y - CENTER) <= 1 && Math.abs(x - CENTER) <= 18) {
        worldLayer[y][x] = 2;
      }
    }
  }

  return worldLayer;
}

function buildLagoonDecorationLayer(worldLayer) {
  const decorationLayer = createLayer(0);

  for (let y = 0; y < MAP_SIZE; y += 1) {
    for (let x = 0; x < MAP_SIZE; x += 1) {
      const tile = worldLayer[y][x];
      const noise = (x * 31 + y * 67 + x * y * 3) % 100;

      if (tile === 4 && noise < 3) {
        decorationLayer[y][x] = 103;
      }

      if (tile === 1) {
        if (noise < 2) decorationLayer[y][x] = 100;
        else if (noise >= 2 && noise < 4) decorationLayer[y][x] = 101;
      }
    }
  }

  return decorationLayer;
}

const worldLayer = buildLagoonWorldLayer();
const decorationLayer = buildLagoonDecorationLayer(worldLayer);

export const lazyLagoonMap = {
  tileSize: 48,
  playerSpawnTile: { x: CENTER, y: CENTER },
  worldLayer,
  decorationLayer,
};
