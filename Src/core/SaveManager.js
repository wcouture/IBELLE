export class SaveManager {
  constructor(storageKey = 'ibelle-environmental-scientist-saves') {
    this.storageKey = storageKey;
  }

  getDefaultSaves() {
    return Array.from({ length: 3 }, (_, index) => ({
      id: index + 1,
      used: false,
      timestamp: null,
      state: null,
    }));
  }

  loadAll() {
    const raw = window.localStorage.getItem(this.storageKey);
    if (!raw) {
      return this.getDefaultSaves();
    }

    try {
      const parsed = JSON.parse(raw);
      const saves = this.getDefaultSaves();
      for (let i = 0; i < saves.length; i += 1) {
        const saved = parsed[i];
        if (saved) {
          saves[i] = {
            id: i + 1,
            used: !!saved.used,
            timestamp: saved.timestamp ?? null,
            state: saved.state ?? null,
          };
        }
      }
      return saves;
    } catch (error) {
      console.error('Failed to load saves.', error);
      return this.getDefaultSaves();
    }
  }

  saveAll(saves) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(saves));
  }

  createSave(slotIndex, initialState = {}) {
    const saves = this.loadAll();
    const slot = saves[slotIndex];

    const saveState = {
      scene: initialState.scene ?? 'TownSquare',
      sciencePoints: initialState.sciencePoints ?? 0,
      knowledgeMeter: initialState.knowledgeMeter ?? 0,
      inventory: initialState.inventory ?? [],
      companions: initialState.companions ?? ['Noonie'],
      createdAt: Date.now(),
    };

    slot.used = true;
    slot.timestamp = new Date().toISOString();
    slot.state = saveState;

    this.saveAll(saves);
    return slot;
  }

  loadSave(slotIndex) {
    const saves = this.loadAll();
    return saves[slotIndex]?.state ?? null;
  }
}
