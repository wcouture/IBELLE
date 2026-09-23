export default class UIManager {
    constructor(scene) {
        this.scene = scene;
    }

    addButton(x, y, text, callback) {
        const button = this.scene.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#0b1220',
            backgroundColor: '#bfdbfe',
            padding: { x: 12, y: 8 },
        }).setInteractive({ useHandCursor: true });

        button.on('pointerdown', callback);
        return button;
    }

    addLabel(x, y, text) {
        const label = this.scene.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#0b1220',
            backgroundColor: '#bfdbfe',
            padding: { x: 12, y: 8 },
        });
        label.setOrigin(0.5);

        return label;
    }
}