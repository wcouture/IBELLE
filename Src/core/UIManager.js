export default class UIManager {
    constructor(scene) {
        this.scene = scene;
        this.uiContainer = this.scene.add.container(0, 0).setDepth(1000);
        this.uiContainer.setScrollFactor(0);

        this.worldLabels = this.scene.add.container(0,0).setDepth(999);
    }

    addButton(x, y, text, callback, centered = true) {
        const button = this.scene.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#0b1220',
            backgroundColor: '#bfdbfe',
            padding: { x: 12, y: 8 },
        }).setInteractive({ useHandCursor: true });

        button.on('pointerdown', callback);
        if (centered) {
            button.setOrigin(0.5);
        }

        this.uiContainer.add(button);
        return button;
    }

    addLabel(x, y, text, centered = true, worldAnchored = false) {
        const label = this.scene.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#0b1220',
            backgroundColor: '#bfdbfe',
            padding: { x: 12, y: 8 },
        });
        if (centered) {
            label.setOrigin(0.5);
        }
        if (worldAnchored) {
            this.worldLabels.add(label);
        } else {
            this.uiContainer.add(label);
        }
        return label;
    }

    removeButton(button) {
        this.uiContainer.remove(button, true);
    }

    removeLabel(label, worldAnchored = false) {
        if (worldAnchored) {
            this.worldLabels.remove(label, true);
        } else {
            this.uiContainer.remove(label, true);
        }
    }
}