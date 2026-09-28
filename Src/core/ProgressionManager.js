export class ProgressionManager {
  constructor(registry = null, initialState = {}) {
    this.registry = registry;
    this.maxKnowledgeMeter = 100;
    this.sciencePoints = Number(initialState.sciencePoints ?? 0);
    this.knowledgeMeter = Number(initialState.knowledgeMeter ?? 0);
    this.syncToRegistry();
  }

  getSciencePoints() {
    return this.sciencePoints;
  }

  setSciencePoints(value) {
    this.sciencePoints = Math.max(0, Number(value) || 0);
    this.syncToRegistry();
    return this.sciencePoints;
  }

  addSciencePoints(value) {
    return this.setSciencePoints(this.sciencePoints + Number(value || 0));
  }

  removeSciencePoints(value) {
    return this.setSciencePoints(this.sciencePoints - Number(value || 0));
  }

  getKnowledgeMeter() {
    return this.knowledgeMeter;
  }

  setKnowledgeMeter(value) {
    const normalized = Math.max(0, Math.min(this.maxKnowledgeMeter, Number(value) || 0));
    this.knowledgeMeter = normalized;
    this.syncToRegistry();
    return this.knowledgeMeter;
  }

  addKnowledgeMeter(value) {
    return this.setKnowledgeMeter(this.knowledgeMeter + Number(value || 0));
  }

  removeKnowledgeMeter(value) {
    return this.setKnowledgeMeter(this.knowledgeMeter - Number(value || 0));
  }

  hydrateFromSave(saveState = null) {
    const source = saveState ?? this.registry?.get('activeSave') ?? {};
    this.sciencePoints = Number(source.sciencePoints ?? this.sciencePoints ?? 0);
    this.knowledgeMeter = Number(source.knowledgeMeter ?? this.knowledgeMeter ?? 0);
    this.syncToRegistry();
    return this;
  }

  syncToActiveSave() {
    if (!this.registry) {
      return this;
    }

    const activeSave = this.registry.get('activeSave') ?? null;
    if (!activeSave) {
      return this;
    }

    activeSave.sciencePoints = this.sciencePoints;
    activeSave.knowledgeMeter = this.knowledgeMeter;
    this.registry.set('activeSave', activeSave);

    const saveManager = this.registry.get('saveManager');
    const saveSlotIndex = this.registry.get('saveSlotIndex');
    if (saveManager && saveSlotIndex !== null && saveSlotIndex !== undefined) {
      saveManager.updateSaveState(saveSlotIndex, activeSave);
    }

    return this;
  }

  syncToRegistry() {
    if (!this.registry) {
      return this;
    }

    this.registry.set('sciencePoints', this.sciencePoints);
    this.registry.set('knowledgeMeter', this.knowledgeMeter);
    this.syncToActiveSave();
    return this;
  }
}
