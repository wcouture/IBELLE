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

    addDialog(message, pageWidth, pageHeight) {
        if (this.activeDialog) return;

        const boxWidth = Math.min(500, pageWidth * 0.8);
        const boxX = pageWidth / 2;
        const boxY = pageHeight * 0.75;

        // Render text first so we can measure its height
        const text = this.scene.add.text(boxX, boxY, message, {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#bfdbfe',
            wordWrap: { width: boxWidth - 32 },
            align: 'center',
        });
        text.setOrigin(0.5, 0.5);

        const hint = this.scene.add.text(boxX, boxY, '[E] Dismiss', {
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#64748b',
        });
        hint.setOrigin(0.5, 0);

        const padding = 16;
        const boxHeight = text.height + hint.height + padding * 2 + 8;
        const textY = boxY - hint.height / 2 - 4;
        const hintY = boxY + text.height / 2 + 8;

        text.setY(textY);
        hint.setY(hintY);

        const box = this.scene.add.rectangle(boxX, boxY, boxWidth, boxHeight, 0x0b1220, 0.9);
        box.setStrokeStyle(2, 0xbfdbfe);

        this.activeDialog = { box, text, hint };
        this.uiContainer.add([box, text, hint]);
    }

    removeDialog() {
        if (!this.activeDialog) return;
        const { box, text, hint } = this.activeDialog;
        this.uiContainer.remove(box, true);
        this.uiContainer.remove(text, true);
        this.uiContainer.remove(hint, true);
        this.activeDialog = null;
    }
}