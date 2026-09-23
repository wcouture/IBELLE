import { ACTIONS } from '../core/Actions';

export const TILE_COLOR_PALETTE = {
  0: null,

  // Base world layer
  1: 0x4ade80, // grass
  2: 0xfbbf24, // dry dirt
  3: 0x86efac, // path
  4: 0x60a5fa, // water
  5: 0x334155, // stone

  // Decor / interactable preview layer
  100: 0x166534, // shrub
  101: 0xbe123c, // flowers
  102: 0x92400e, // signpost
  103: 0x0ea5e9, // ripple marker
};

export const TILE_COLLECTION = {
  0: null,
  
  1: {
    name: 'grass',
    texture: 'grass',
    interactable: false,
  },
  2: {
    name: 'dry dirt',
    texture: 'dry_dirt',
    interactable: false,
  },
  3: {
    name: 'path',
    texture: 'path',
    interactable: false,
  },
  4: {
    name: 'water',
    texture: 'water',
    interactable: false,
  },
  5: {
    name: 'stone',
    texture: 'stone',
    interactable: false,
  },

  100: {
    name: 'shrub',
    texture: 'shrub',
    interactable: true,
    interact_radius: 50,
    interact_action: ACTIONS.SHAKE,
  },
  101: {
    name: 'flowers',
    texture: 'flowers',
    interactable: true,
    interact_radius: 50,
    interact_action: ACTIONS.PICK,
  },
  102: {
    name: 'signpost',
    texture: 'signpost',
    interactable: true,
    interact_radius: 50,
    interact_action: ACTIONS.READ,
  },
  103: {
    name: 'ripple marker',
    texture: 'ripple_marker',
    interactable: true,
    interact_radius: 50,
    interact_action: ACTIONS.RIPPLE,
  },
};
