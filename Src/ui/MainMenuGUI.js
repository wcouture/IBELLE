export class MainMenuGUI {
    constructor(uiManager, pageWidth = 1280, pageHeight = 720) {
        this.startButtonSubscribers = [];
        this.loadButtonSubscribers = [];
        this.settingsButtonSubscribers = [];

        this.pageWidth = pageWidth;
        this.pageHeight = pageHeight;
        this.uiManager = uiManager;

        const centerX = this.pageWidth / 2;
        const titleY = this.pageHeight * 0.28;
        const firstButtonY = this.pageHeight * 0.42;
        const buttonSpacing = Math.max(52, this.pageHeight * 0.08);

        this.titleLabel = this.uiManager.addLabel(centerX, titleY, 'IBELLE');

        this.startButton = this.uiManager.addButton(centerX, firstButtonY, 'Start Game', () => {
            this.notifySubscribers(this.startButtonSubscribers);
        });

        this.loadButton = this.uiManager.addButton(centerX, firstButtonY + buttonSpacing, 'Load Game', () => {
            this.notifySubscribers(this.loadButtonSubscribers);
        });

        this.settingsButton = this.uiManager.addButton(centerX, firstButtonY + (buttonSpacing * 2), 'Settings', () => {
            this.notifySubscribers(this.settingsButtonSubscribers);
        });
    }

    notifySubscribers(subscribers) {
        for (const callback of subscribers) {
            callback();
        }
    }

    subscribeToStartButton(callback) {
        this.startButtonSubscribers.push(callback);
    }

    subscribeToLoadButton(callback) {
        this.loadButtonSubscribers.push(callback);
    }

    subscribeToSettingsButton(callback) {
        this.settingsButtonSubscribers.push(callback);
    }
};