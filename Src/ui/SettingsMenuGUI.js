export class SettingsMenuGUI {
  constructor(uiManager, inputManager, initialVolume = 80, pageWidth = 1280, pageHeight = 720) {
    this.uiManager = uiManager;
    this.inputManager = inputManager;
    this.onBack = null;
    this.onVolumeChange = null;
    this.onCaptureStart = null;
    this.pageWidth = pageWidth;
    this.pageHeight = pageHeight;
    this.volumeValue = Math.max(0, Math.min(100, initialVolume));
    this.bindingCurrentValues = {};

    const centerX = this.pageWidth / 2;
    const titleY = this.pageHeight * 0.15;
    const volumeY = this.pageHeight * 0.25;
    const keyTitleY = this.pageHeight * 0.42;
    const backY = this.pageHeight * 0.87;

    this.titleLabel = this.uiManager.addLabel(centerX, titleY, 'Settings', true);
    this.volumeLabel = this.uiManager.addLabel(centerX, volumeY, `Volume: ${this.volumeValue}%`, true);

    this.volumeMinus = this.uiManager.addButton(centerX - 120, volumeY + 36, '-', () => this.adjustVolume(-10), true);
    this.volumeBar = this.uiManager.addLabel(centerX, volumeY + 36, this.renderVolumeBar(this.volumeValue), true);
    this.volumeBar.setOrigin(0.5);
    this.volumePlus = this.uiManager.addButton(centerX + 120, volumeY + 36, '+', () => this.adjustVolume(10), true);

    this.keybindTitle = this.uiManager.addLabel(centerX, keyTitleY, 'Key Bindings', true);
    this.bindingLabels = {};
    this.bindingButtons = {};

    this.bindings = [
      { action: 'up', label: 'Move Up' },
      { action: 'down', label: 'Move Down' },
      { action: 'left', label: 'Move Left' },
      { action: 'right', label: 'Move Right' },
      { action: 'interact', label: 'Interact' },
    ];

    this.renderBindings();

    this.backButton = this.uiManager.addButton(centerX, backY, 'Back', () => {
      this.onBack?.();
    });
  }

  renderVolumeBar(value) {
    const filled = Math.round(value / 10);
    return `${'█'.repeat(filled)}${'░'.repeat(10 - filled)}`;
  }

  adjustVolume(delta) {
    const nextValue = Math.max(0, Math.min(100, this.volumeValue + delta));
    this.updateVolume(nextValue);
    this.onVolumeChange?.(nextValue);
  }

  updateVolume(value) {
    this.volumeValue = Math.max(0, Math.min(100, value));
    this.volumeLabel.setText(`Volume: ${this.volumeValue}%`);
    this.volumeBar.setText(this.renderVolumeBar(this.volumeValue));
  }

  renderBindings() {
    this.bindings.forEach(({ action, label }, index) => {
      const rowY = this.pageHeight * 0.48 + index * 52;
      const textX = this.pageWidth * 0.38;
      const keyX = this.pageWidth * 0.52;
      const buttonX = this.pageWidth * 0.68;

      const textLabel = this.uiManager.addLabel(textX, rowY, `${label}:`, false);
      const currentKeyLabel = this.uiManager.addLabel(keyX, rowY, this.inputManager.getBindingLabel(action), false);
      const button = this.uiManager.addButton(buttonX, rowY, 'Rebind', () => {
        this.startCapture(action);
      }, false);

      button.setOrigin(0.5);
      textLabel.setOrigin(0.5);
      currentKeyLabel.setOrigin(0.5);

      this.bindingLabels[action] = textLabel;
      this.bindingButtons[action] = button;
      this.bindingCurrentValues[action] = currentKeyLabel;
    });
  }

  startCapture(action) {
    if (this.captureText) {
      this.captureText.destroy();
      this.captureText = null;
    }

    this.captureText = this.uiManager.addLabel(640, 560, `Press a key for ${action.toUpperCase()}`, false);
    this.captureAction = action;
    this.onCaptureStart?.(action);

    Object.values(this.bindingButtons).forEach((bindingButton) => {
      bindingButton.setAlpha(0.7);
    });

    const currentButton = this.bindingButtons[action];
    if (currentButton) {
      currentButton.setAlpha(1);
    }
  }

  clearCapture() {
    if (this.captureText) {
      this.captureText.destroy();
      this.captureText = null;
    }

    Object.values(this.bindingButtons).forEach((bindingButton) => {
      bindingButton.setAlpha(1);
    });

    this.captureAction = null;
  }

  refreshBindings() {
    Object.entries(this.bindingCurrentValues || {}).forEach(([action, label]) => {
      label.setText(this.inputManager.getBindingLabel(action));
    });
  }

  subscribeToBack(callback) {
    this.onBack = callback;
  }

  subscribeToVolumeChange(callback) {
    this.onVolumeChange = callback;
  }

  subscribeToCaptureStart(callback) {
    this.onCaptureStart = callback;
  }
}
