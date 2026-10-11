import { getItem } from "@/lib/avatar/catalog";
import {
  cloneDefault,
  cloneEquipped,
  equipItem,
  nakedFrom,
  sameEquipped,
  unequipItem,
} from "@/lib/avatar/equipped";
import type { EquippedAvatar } from "@/types/avatar";

/** Session-only. localStorage stores the current outfit, not this stack. */
const HISTORY_LIMIT = 30;

export interface AvatarStoreState {
  equipped: EquippedAvatar;
  past: EquippedAvatar[];
}

export const initialAvatarState: AvatarStoreState = {
  equipped: cloneDefault(),
  past: [],
};

export type AvatarAction =
  | { type: "hydrate"; equipped: EquippedAvatar }
  | { type: "equip"; itemId: string }
  | { type: "unequip"; itemId: string }
  | { type: "reset" }
  | { type: "naked" }
  | { type: "undo" };

function remember(state: AvatarStoreState, next: EquippedAvatar): AvatarStoreState {
  if (sameEquipped(state.equipped, next)) return state;
  return {
    equipped: next,
    past: [...state.past, cloneEquipped(state.equipped)].slice(-HISTORY_LIMIT),
  };
}

export function avatarReducer(state: AvatarStoreState, action: AvatarAction): AvatarStoreState {
  switch (action.type) {
    case "hydrate":
      return { equipped: cloneEquipped(action.equipped), past: [] };
    case "equip": {
      const item = getItem(action.itemId);
      if (!item) return state;
      return remember(state, equipItem(state.equipped, item));
    }
    case "unequip": {
      const item = getItem(action.itemId);
      if (!item) return state;
      return remember(state, unequipItem(state.equipped, item));
    }
    case "reset":
      return remember(state, cloneDefault());
    case "naked":
      return remember(state, nakedFrom(state.equipped));
    case "undo": {
      const previous = state.past[state.past.length - 1];
      if (!previous) return state;
      return {
        equipped: cloneEquipped(previous),
        past: state.past.slice(0, -1),
      };
    }
    default: {
      const _never: never = action;
      return _never;
    }
  }
}
