import { avatarReducer, initialAvatarState, type AvatarAction, type AvatarStoreState } from "@/lib/avatar/reducer";
import { loadEquipped, saveEquipped } from "@/lib/avatar/storage";

/**
 * Client outfit store.
 *
 * The React tree reads this through `useSyncExternalStore` so the saved
 * avatar can load without a setState-in-effect. Undo history stays in
 * memory. `lib/avatar/storage.ts` is the only localStorage boundary —
 * replace that module when the outfit moves to an account.
 */

const listeners = new Set<() => void>();
let clientState: AvatarStoreState | null = null;

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeAvatar(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getServerAvatarSnapshot(): AvatarStoreState {
  return initialAvatarState;
}

export function getAvatarSnapshot(): AvatarStoreState {
  if (typeof window === "undefined") return initialAvatarState;
  if (!clientState) {
    const saved = loadEquipped();
    clientState = saved ? { equipped: saved, past: [] } : initialAvatarState;
  }
  return clientState;
}

export function dispatchAvatar(action: AvatarAction) {
  if (typeof window === "undefined") return;
  const current = getAvatarSnapshot();
  const next = avatarReducer(current, action);
  if (next === current) return;
  clientState = next;
  saveEquipped(next.equipped);
  emit();
}
