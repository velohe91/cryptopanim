import { sanitizeEquipped } from "@/lib/avatar/equipped";
import type { EquippedAvatar } from "@/types/avatar";

/**
 * Browser-local outfit save.
 *
 * Swap this module for a profile API later. Callers should keep using
 * `loadEquipped` / `saveEquipped` so the dressing room does not talk to
 * localStorage directly. Undo history is intentionally not persisted.
 */
export const AVATAR_STORAGE_KEY = "cryptopanim.avatar.v1";

interface PersistedAvatar {
  version: 1;
  equipped: EquippedAvatar;
}

export function loadEquipped(): EquippedAvatar | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedAvatar>;
    if (parsed.version !== 1) return null;
    return sanitizeEquipped(parsed.equipped);
  } catch {
    return null;
  }
}

export function saveEquipped(equipped: EquippedAvatar): void {
  if (typeof window === "undefined") return;
  const payload: PersistedAvatar = { version: 1, equipped };
  window.localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(payload));
}
