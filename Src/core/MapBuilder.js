export class MapBuilder {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.worldLayer = this.initializeMap();
        this.decorationLayer = this.initializeMap();
    }

    initializeMap() {
        let grid = [];
        for (let y = 0; y < this.height; y++) {
            let row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(1); // Initialize with default tile ID (e.g., 0)
            }
            grid.push(row);
        }
        return grid;
    }

    setWorldTile(x, y, tileId) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.worldLayer[y][x] = tileId;
        }
    }

    setDecorationTile(x, y, tileId) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.decorationLayer[y][x] = tileId;
        }
    }

    getWorldTile(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.worldLayer[y][x];
        }
    }

    getDecorationTile(x, y) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.decorationLayer[y][x];
        }
    }

    getMap() {
        const mapData = {
          tileSize: 12,
          playerSpawnTile: { x: this.width / 2, y: this.height / 2 },
          worldLayer: this.worldLayer,
          decorationLayer: this.decorationLayer,
          signMessages: {},
        };

        return mapData;
    }
    
}
