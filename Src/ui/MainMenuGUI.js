export class MainMenuGUI {
    constructor(uiManager) {
        this.startButtonSubscribers = [];
        this.loadButtonSubscribers = [];
        this.settingsButtonSubscribers = [];

        this.uiManager = uiManager;
        this.titleLabel = this.uiManager.addLabel(400, 200, 'IBELLE');

        this.startButton = this.uiManager.addButton(400, 300, 'Start Game', () => {
            this.notifySubscribers(this.startButtonSubscribers);
        });

        this.loadButton = this.uiManager.addButton(400, 360, 'Load Game', () => {
            this.notifySubscribers(this.loadButtonSubscribers);
        });

        this.settingsButton = this.uiManager.addButton(400, 420, 'Settings', () => {
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